import { createWorker, PSM, OEM } from 'tesseract.js';

// PDF.js imports for browser-based PDF processing
let pdfjsLib: any = null;

// Dynamically import pdfjs-dist for browser-based PDF processing
async function getPdfjsLib() {
  if (!pdfjsLib) {
    try {
      console.log('Attempting to load PDF.js library...');
      
      // Try multiple import methods
      try {
        // Method 1: Direct import
        pdfjsLib = await import('pdfjs-dist');
      } catch (directError) {
        console.warn('Direct import failed, trying legacy build:', directError);
        
        // If direct import fails, we'll just use OCR fallback
        throw new Error('PDF.js import failed');
      }
      
      // Configure worker with multiple fallbacks
      if (pdfjsLib) {
        try {
          // Try local worker first
          pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
          console.log('Using local PDF worker');
        } catch (localWorkerError) {
          // Fallback to CDN
          pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          console.log('Using CDN PDF worker');
        }
        
        console.log('PDF.js loaded successfully with version:', pdfjsLib.version || 'unknown');
        return pdfjsLib;
      }
      
    } catch (error) {
      console.error('Failed to load PDF.js library:', error);
      return null;
    }
  }
  return pdfjsLib;
}

/**
 * Extract text from PDF file using PDF.js with OCR fallback
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  console.log(`Starting PDF text extraction for file: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
  
  try {
    const pdfLib = await getPdfjsLib();
    
    if (!pdfLib) {
      console.log('PDF.js library not available, using OCR method');
      return await extractTextFromPDFUsingOCR(file);
    }
    
    console.log('Attempting PDF text extraction with PDF.js...');
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    console.log(`PDF loaded successfully. Pages: ${pdf.numPages}`);
    
    let fullText = '';
    let totalChars = 0;
    
    // Extract text from all pages
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      try {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        
        if (pageText.trim()) {
          fullText += `\n--- Page ${pageNum} ---\n${pageText}\n`;
          totalChars += pageText.length;
        }
        
        console.log(`Page ${pageNum} processed, extracted ${pageText.length} characters`);
      } catch (pageError) {
        console.warn(`Failed to extract text from page ${pageNum}:`, pageError);
      }
    }
    
    const extractedText = fullText.trim();
    console.log(`PDF.js extraction completed. Total characters: ${totalChars}`);
    
    // If we got very little text or mostly empty, try OCR as backup
    if (!extractedText || totalChars < 100) {
      console.log('PDF.js extracted minimal text, trying OCR fallback');
      return await extractTextFromPDFUsingOCR(file);
    }
    
    return extractedText;
    
  } catch (error) {
    console.error('PDF.js extraction failed, trying OCR fallback:', error);
    try {
      return await extractTextFromPDFUsingOCR(file);
    } catch (ocrError) {
      console.error('OCR fallback also failed:', ocrError);
      // Return a more helpful error message instead of the generic fallback
      throw new Error(`Failed to extract text from PDF. This might be a scanned document or contain complex formatting. Please try converting to an image (JPG/PNG) format.`);
    }
  }
}

/**
 * Fallback method: Convert PDF to images and use OCR
 */
async function extractTextFromPDFUsingOCR(file: File): Promise<string> {
  try {
    console.log('Using OCR fallback for PDF processing');
    
    const pdfLib = await getPdfjsLib();
    if (!pdfLib) {
      // Final fallback: Use a simple message and suggest alternatives
      return await handlePDFWithoutLibrary(file);
    }
    
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    console.log('Creating OCR worker with Chinese support for PDF...');
    const worker = await createWorker(['eng', 'chi_sim']);
    
    // Configure OCR for better Chinese text recognition
    await worker.setParameters({
      tessedit_char_whitelist: '',
      tessedit_pageseg_mode: PSM.AUTO_OSD, // Automatic page segmentation with OSD
      tessedit_ocr_engine_mode: OEM.LSTM_ONLY, // Neural nets LSTM engine only
    });
    
    // Convert each page to canvas and OCR it
    for (let pageNum = 1; pageNum <= Math.min(pdf.numPages, 10); pageNum++) { // Limit to 10 pages for performance
      try {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better OCR
        
        // Create canvas
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        // Render page to canvas
        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;
        
        // Convert canvas to blob for OCR
        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((blob) => resolve(blob!), 'image/png');
        });
        
        // OCR the image
        const { data: { text } } = await worker.recognize(blob);
        
        if (text.trim()) {
          fullText += `\n--- Page ${pageNum} (OCR) ---\n${text}\n`;
        }
        
        console.log(`OCR completed for page ${pageNum}`);
      } catch (pageError) {
        console.warn(`Failed to process page ${pageNum}:`, pageError);
      }
    }
    
    await worker.terminate();
    
    return fullText.trim() || 'No text content found in PDF (OCR)';
    
  } catch (error) {
    console.error('OCR fallback failed:', error);
    throw new Error(`PDF OCR processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Final fallback when PDF.js is completely unavailable
 */
async function handlePDFWithoutLibrary(file: File): Promise<string> {
  console.log('PDF.js completely unavailable, providing guidance message');
  
  const fileName = file.name;
  const fileSize = (file.size / 1024 / 1024).toFixed(2); // Size in MB
  
  return `PDF Processing Notice:

File: ${fileName} (${fileSize} MB)

Unfortunately, PDF text extraction is currently unavailable due to library loading issues. 

To analyze your medical report, please try one of these alternatives:

1. RECOMMENDED: Convert your PDF to an image (JPG/PNG) and upload the image instead
   - Take a screenshot of each page
   - Use a PDF-to-image converter
   - Our OCR system can extract text from images very effectively

2. Copy and paste the text directly into a new conversation
   - Open your PDF in a viewer
   - Select and copy the text content
   - Start a new conversation and paste the content

3. Try refreshing the page and uploading again
   - Sometimes the PDF library needs a fresh page load

We apologize for the inconvenience. The image OCR method typically provides excellent results for medical reports.`;
}

/**
 * Extract text from image using OCR with Chinese support
 */
export async function extractTextFromImage(file: File): Promise<string> {
  try {
    console.log('Starting OCR for image with Chinese support...');
    
    // Create worker with both English and Chinese (Simplified) support
    const worker = await createWorker(['eng', 'chi_sim']);
    
    // Configure OCR for better Chinese text recognition
    await worker.setParameters({
      tessedit_char_whitelist: '',
      tessedit_pageseg_mode: PSM.AUTO_OSD, // Automatic page segmentation with OSD
      tessedit_ocr_engine_mode: OEM.LSTM_ONLY, // Neural nets LSTM engine only
    });
    
    console.log('OCR worker configured for Chinese text');
    
    // Perform OCR directly with the File object
    const { data: { text } } = await worker.recognize(file);
    
    // Clean up worker
    await worker.terminate();
    
    const extractedText = text.trim();
    console.log('OCR completed, extracted text length:', extractedText.length);
    
    return extractedText || 'No text content found in image';
  } catch (error) {
    console.error('Error extracting text from image:', error);
    throw new Error(`Failed to extract text from image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Detect if text contains Chinese characters
 */
function containsChinese(text: string): boolean {
  const chineseRegex = /[\u4e00-\u9fff\u3400-\u4dbf\u20000-\u2a6df\u2a700-\u2b73f\u2b740-\u2b81f\u2b820-\u2ceaf\uf900-\ufaff\u3300-\u33ff\ufe30-\ufe4f\uf900-\ufaff\u2f800-\u2fa1f]/;
  return chineseRegex.test(text);
}

/**
 * Create a conversation from extracted text for medical report analysis
 */
export function createMedicalReportConversation(extractedText: string, fileName: string) {
  const isChinese = containsChinese(extractedText);
  
  let userMessage: string;
  let conversationName: string;
  
  if (isChinese) {
    // Chinese prompt - only show extracted text without duplicate prompt
    userMessage = `${extractedText}

1. 请分析这份报告，详细分析每个异常指标,考虑异常指标之间的相关性。
2. 根据用户的当前地理位置，使用tavily_search工具找到排名靠前的医院，推荐排名靠前的复查医院和科室。请用中文回复。`;
    
    conversationName = `医疗报告分析: ${fileName}`;
  } else {
    // English prompt - only show extracted text without duplicate prompt
    userMessage = `${extractedText}

Please analyze this report, identify any abnormal indicators, and recommend which hospital department I should visit. If you find any concerning values, please use web search to provide additional context about these findings.`;
    
    conversationName = `Medical Report Analysis: ${fileName}`;
  }

  return {
    id: Date.now().toString(),
    name: conversationName,
    folderId: null,
    messages: [
      {
        id: '1',
        role: 'user' as const,
        content: userMessage,
      }
    ],
  };
}
