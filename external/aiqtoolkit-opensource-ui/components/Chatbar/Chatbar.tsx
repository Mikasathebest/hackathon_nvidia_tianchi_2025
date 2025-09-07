import { useCallback, useContext, useEffect } from 'react';

import { useTranslation } from 'next-i18next';

import { useCreateReducer } from '@/hooks/useCreateReducer';

import { saveConversation, saveConversations } from '@/utils/app/conversation';
import { saveFolders } from '@/utils/app/folders';
import { exportData, importData, importFile } from '@/utils/app/importExport';

import { Conversation } from '@/types/chat';
import { LatestExportFormat } from '@/types/export';
import { ImportedFile } from '@/types/import';

import HomeContext from '@/pages/api/home/home.context';

import { ChatFolders } from './components/ChatFolders';
import { ChatbarSettings } from './components/ChatbarSettings';
import { Conversations } from './components/Conversations';

import Sidebar from '../Sidebar';
import ChatbarContext from './Chatbar.context';
import { ChatbarInitialState, initialState } from './Chatbar.state';

import { v4 as uuidv4 } from 'uuid';

export const Chatbar = () => {
  const { t } = useTranslation('sidebar');

  const chatBarContextValue = useCreateReducer<ChatbarInitialState>({
    initialState,
  });

  const {
    state: { conversations, showChatbar, folders },
    dispatch: homeDispatch,
    handleCreateFolder,
    handleNewConversation,
    handleUpdateConversation,
  } = useContext(HomeContext);

  const {
    state: { searchTerm, filteredConversations },
    dispatch: chatDispatch,
  } = chatBarContextValue;

  const handleExportData = () => {
    exportData();
  };

  // Function to trigger medical analysis after PDF/image processing
  const triggerMedicalAnalysis = async (conversation: Conversation) => {
    try {
      console.log('Triggering medical analysis for conversation:', conversation.id);
      
      // Find the user message in the conversation
      const userMessage = conversation.messages.find(msg => msg.role === 'user');
      if (!userMessage) {
        console.error('No user message found in conversation');
        return;
      }

      // Create a custom event to trigger the chat submission
      const chatEvent = new CustomEvent('triggerMedicalAnalysis', {
        detail: {
          conversationId: conversation.id,
          userMessage: userMessage,
          conversation: conversation
        }
      });
      
      // Dispatch the event for the Chat component to handle
      window.dispatchEvent(chatEvent);
      
    } catch (error) {
      console.error('Error triggering medical analysis:', error);
    }
  };

  const handleImportConversations = async (importedFile: ImportedFile) => {
    try {
      // Show loading state
      const loadingToast = 'Processing file...';
      console.log(loadingToast);
      
      const { history, folders: importedFolders, prompts }: LatestExportFormat = await importFile(importedFile);
      
      // Get current conversations from state to merge with new ones
      const currentConversations = conversations || [];
      const mergedConversations = [...currentConversations, ...history];
      
      // Update the conversations list
      homeDispatch({ field: 'conversations', value: mergedConversations });
      
      // Select the newly imported conversation (last one in history)
      const newConversation = history[history.length - 1];
      homeDispatch({
        field: 'selectedConversation',
        value: newConversation,
      });
      
      // Update folders if any
      if (importedFolders && importedFolders.length > 0) {
        const currentFolders = folders || [];
        const mergedFolders = [...currentFolders, ...importedFolders];
        homeDispatch({ field: 'folders', value: mergedFolders });
      }
      
      // Store in session storage for persistence
      sessionStorage.setItem('conversationHistory', JSON.stringify(mergedConversations));
      sessionStorage.setItem('selectedConversation', JSON.stringify(newConversation));
      
      // Success message
      if (importedFile.type === 'pdf' || importedFile.type === 'image') {
        alert(`✅ Medical report processed successfully! A new conversation has been created with analysis of "${importedFile.fileName}". The AI will now analyze your report.`);
      }

      // Auto-trigger LLM analysis for medical reports
      if (importedFile.type === 'pdf' || importedFile.type === 'image') {
        // Trigger the analysis by sending the user message to the LLM
        setTimeout(() => {
          triggerMedicalAnalysis(newConversation);
        }, 500); // Small delay to ensure UI is updated
      }
    } catch (error) {
      alert(`❌ Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleClearConversations = () => {
      homeDispatch({
        field: 'selectedConversation',
        value: {
          id: uuidv4(),
          name: t('New Conversation'),
          messages: [],
          folderId: null,
        },
      });

    homeDispatch({ field: 'conversations', value: [] });

    sessionStorage.removeItem('conversationHistory');
    sessionStorage.removeItem('selectedConversation');

    const updatedFolders = folders.filter((f) => f.type !== 'chat');

    homeDispatch({ field: 'folders', value: updatedFolders });
    saveFolders(updatedFolders);
  };

  const handleDeleteConversation = (conversation: Conversation) => {
    const updatedConversations = conversations.filter(
      (c) => c.id !== conversation.id,
    );

    homeDispatch({ field: 'conversations', value: updatedConversations });
    chatDispatch({ field: 'searchTerm', value: '' });
    saveConversations(updatedConversations);

    if (updatedConversations.length > 0) {
      homeDispatch({
        field: 'selectedConversation',
        value: updatedConversations[updatedConversations.length - 1],
      });

      saveConversation(updatedConversations[updatedConversations.length - 1]);
    } else {
        homeDispatch({
          field: 'selectedConversation',
          value: {
            id: uuidv4(),
            name: t('New Conversation'),
            messages: [],
            folderId: null,
          },
        });

        sessionStorage.removeItem('selectedConversation');
    }
  };

  const handleToggleChatbar = () => {
    homeDispatch({ field: 'showChatbar', value: !showChatbar });
    sessionStorage.setItem('showChatbar', JSON.stringify(!showChatbar));
  };

  const handleDrop = (e: any) => {
    if (e.dataTransfer) {
      const conversation = JSON.parse(e.dataTransfer.getData('conversation'));
      handleUpdateConversation(conversation, { key: 'folderId', value: 0 });
      chatDispatch({ field: 'searchTerm', value: '' });
      e.target.style.background = 'none';
    }
  };

  useEffect(() => {
    if (searchTerm) {
      chatDispatch({
        field: 'filteredConversations',
        value: conversations.filter((conversation) => {
          const searchable =
            conversation.name.toLocaleLowerCase() +
            ' ' +
            conversation.messages.map((message) => message.content).join(' ');
          return searchable.toLowerCase().includes(searchTerm.toLowerCase());
        }),
      });
    } else {
      chatDispatch({
        field: 'filteredConversations',
        value: conversations,
      });
    }
  }, [searchTerm, conversations, chatDispatch]);

  return (
    <ChatbarContext.Provider
      value={{
        ...chatBarContextValue,
        handleDeleteConversation,
        handleClearConversations,
        handleImportConversations,
        handleExportData,
      }}
    >
      <Sidebar<Conversation>
        side={'left'}
        isOpen={showChatbar}
        addItemButtonTitle={t('New chat')}
        itemComponent={<Conversations conversations={filteredConversations} />}
        folderComponent={<ChatFolders searchTerm={searchTerm} />}
        items={filteredConversations}
        searchTerm={searchTerm}
        handleSearchTerm={(searchTerm: string) =>
          chatDispatch({ field: 'searchTerm', value: searchTerm })
        }
        toggleOpen={handleToggleChatbar}
        handleCreateItem={handleNewConversation}
        handleCreateFolder={() => handleCreateFolder(t('New folder'), 'chat')}
        handleDrop={handleDrop}
        footerComponent={<ChatbarSettings />}
      />
    </ChatbarContext.Provider>
  );
};
