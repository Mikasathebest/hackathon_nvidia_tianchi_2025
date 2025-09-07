import { Conversation } from '@/types/chat';
import {
  ExportFormatV1,
  ExportFormatV2,
  ExportFormatV3,
  ExportFormatV4,
  LatestExportFormat,
  SupportedExportFormats,
} from '@/types/export';
import { FolderInterface } from '@/types/folder';
import { Prompt } from '../../types/prompt';
import { ImportedFile } from '@/types/import';

import { cleanConversationHistory } from './clean';
import { extractTextFromPDF, extractTextFromImage, createMedicalReportConversation } from './textExtraction';

export function isExportFormatV1(obj: any): obj is ExportFormatV1 {
  return Array.isArray(obj);
}

export function isExportFormatV2(obj: any): obj is ExportFormatV2 {
  return !('version' in obj) && 'folders' in obj && 'history' in obj;
}

export function isExportFormatV3(obj: any): obj is ExportFormatV3 {
  return obj.version === 3;
}

export function isExportFormatV4(obj: any): obj is ExportFormatV4 {
  return obj.version === 4;
}

export const isLatestExportFormat = isExportFormatV4;

export function cleanData(data: SupportedExportFormats): LatestExportFormat {
  if (isExportFormatV1(data)) {
    return {
      version: 4,
      history: cleanConversationHistory(data),
      folders: [],
      prompts: [],
    };
  }

  if (isExportFormatV2(data)) {
    return {
      version: 4,
      history: cleanConversationHistory(data.history || []),
      folders: (data.folders || []).map((chatFolder) => ({
        id: chatFolder.id.toString(),
        name: chatFolder.name,
        type: 'chat',
      })),
      prompts: [],
    };
  }

  if (isExportFormatV3(data)) {
    return { ...data, version: 4, prompts: [] };
  }

  if (isExportFormatV4(data)) {
    return data;
  }

  throw new Error('Unsupported data format');
}

function currentDate() {
  const date = new Date();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}-${day}`;
}

export const exportData = () => {
  let history = sessionStorage.getItem('conversationHistory');
  let folders = sessionStorage.getItem('folders');
  let prompts = sessionStorage.getItem('prompts');

  if (history) {
    history = JSON.parse(history);
  }

  if (folders) {
    folders = JSON.parse(folders);
  }

  if (prompts) {
    prompts = JSON.parse(prompts);
  }

  const data = {
    version: 4,
    history: history || [],
    folders: folders || [],
    prompts: prompts || [],
  } as LatestExportFormat;

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `chatbot_ui_history_${currentDate()}.json`;
  link.href = url;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// New function to handle ImportedFile
export const importFile = async (
  importedFile: ImportedFile,
): Promise<LatestExportFormat> => {
  if (importedFile.type === 'json') {
    // Handle JSON files - return the cleaned data without session storage manipulation
    return cleanData(importedFile.data as SupportedExportFormats);
  } else if (importedFile.type === 'pdf') {
    // Extract text from PDF and create medical analysis conversation
    try {
      const extractedText = await extractTextFromPDF(importedFile.data as File);
      const conversation = createMedicalReportConversation(extractedText, importedFile.fileName);
      
      // Create the format with the new conversation (no session storage handling here)
      return {
        version: 4,
        history: [conversation],
        folders: [],
        prompts: [],
      };
    } catch (error) {
      throw new Error(`PDF processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  } else if (importedFile.type === 'image') {
    // Extract text from image using OCR and create medical analysis conversation
    try {
      const extractedText = await extractTextFromImage(importedFile.data as File);
      const conversation = createMedicalReportConversation(extractedText, importedFile.fileName);
      
      // Create the format with the new conversation (no session storage handling here)
      return {
        version: 4,
        history: [conversation],
        folders: [],
        prompts: [],
      };
    } catch (error) {
      throw new Error(`Image OCR processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  } else {
    throw new Error('Unsupported file type');
  }
};

export const importData = (
  data: SupportedExportFormats,
): LatestExportFormat => {
  const { history, folders, prompts } = cleanData(data);

  const oldConversations = sessionStorage.getItem('conversationHistory');
  const oldConversationsParsed = oldConversations
    ? JSON.parse(oldConversations)
    : [];

  const newHistory: Conversation[] = [
    ...oldConversationsParsed,
    ...history,
  ].filter(
    (conversation, index, self) =>
      index === self.findIndex((c) => c.id === conversation.id),
  );
  sessionStorage.setItem('conversationHistory', JSON.stringify(newHistory));
  if (newHistory.length > 0) {
    sessionStorage.setItem(
      'selectedConversation',
      JSON.stringify(newHistory[newHistory.length - 1]),
    );
  } else {
    sessionStorage.removeItem('selectedConversation');
  }

  const oldFolders = sessionStorage.getItem('folders');
  const oldFoldersParsed = oldFolders ? JSON.parse(oldFolders) : [];
  const newFolders: FolderInterface[] = [
    ...oldFoldersParsed,
    ...folders,
  ].filter(
    (folder, index, self) =>
      index === self.findIndex((f) => f.id === folder.id),
  );
  sessionStorage.setItem('folders', JSON.stringify(newFolders));

  const oldPrompts = sessionStorage.getItem('prompts');
  const oldPromptsParsed = oldPrompts ? JSON.parse(oldPrompts) : [];
  const newPrompts: Prompt[] = [...oldPromptsParsed, ...prompts].filter(
    (prompt, index, self) =>
      index === self.findIndex((p) => p.id === prompt.id),
  );
  sessionStorage.setItem('prompts', JSON.stringify(newPrompts));

  return {
    version: 4,
    history: newHistory,
    folders: newFolders,
    prompts: newPrompts,
  };
};
