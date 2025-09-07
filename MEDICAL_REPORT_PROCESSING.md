# Medical Report Processing Feature

## Overview
The AIQ Toolkit now supports intelligent medical report analysis through PDF and image upload functionality. This feature is designed to help users analyze medical reports and get recommendations for appropriate hospital departments.

## Features

### 📄 PDF Text Extraction
- Extracts text from multi-page PDF medical reports
- Uses PDF.js for reliable browser-based processing
- Handles complex medical document layouts

### 🖼️ Image OCR Processing  
- Optical Character Recognition for JPG, JPEG, PNG images
- Uses Tesseract.js for accurate text extraction
- Ideal for scanned medical reports or photos of documents

### 🤖 Intelligent Medical Analysis
- Creates specialized conversations for medical report analysis
- System prompt optimized for identifying abnormal indicators
- Guides users to appropriate hospital departments
- Integrates with web search tools for additional medical context

## How to Use

1. **Upload Your Medical Report**
   - Click the "Import data" button in the sidebar
   - Select a PDF file or image (JPG, PNG) of your medical report
   - Wait for processing (you'll see a loading indicator)

2. **Automatic Analysis**
   - The system extracts text from your file
   - Creates a new conversation with medical analysis focus
   - Sends the extracted content to the LLM for analysis

3. **Get Recommendations**
   - The AI will identify abnormal values or concerning findings
   - Provides recommendations for which hospital department to visit
   - Uses web search tools to provide additional medical context
   - Offers guidance while emphasizing this is for informational purposes

## Supported File Types

- **PDF**: `.pdf` files (medical reports, lab results, etc.)
- **Images**: `.jpg`, `.jpeg`, `.png` files (scanned documents, photos)
- **JSON**: `.json` files (conversation backup/restore)

## Technical Implementation

### Backend Integration
- Uses the NAT (NVIDIA Agent Toolkit) backend running on port 8001
- Configured via `configs/hackathon_config_new.yml`
- Integrates with web search tools for medical research

### Frontend Processing
- Browser-based PDF processing (no server upload required)
- Client-side OCR for privacy-sensitive medical documents
- Real-time loading states and error handling
- Responsive UI with progress indicators

### Medical Analysis Prompt
The system uses a specialized prompt that:
- Focuses on identifying abnormal medical indicators
- Provides hospital department recommendations
- Emphasizes informational nature (not medical advice)
- Encourages web search for additional context

## Privacy & Security
- All file processing happens locally in the browser
- No medical documents are uploaded to external servers
- Text extraction occurs client-side before sending to LLM
- Conversations are stored locally in browser session storage

## Error Handling
- Graceful fallbacks for unsupported file types
- Clear error messages for processing failures
- Retry mechanisms for network issues
- User-friendly progress indicators

## Example Use Cases

1. **Lab Results Analysis**
   - Upload blood test results PDF
   - Get analysis of abnormal values
   - Receive department recommendations (e.g., "Visit Endocrinology for elevated glucose")

2. **Radiology Reports**
   - Upload X-ray or MRI report images
   - Extract and analyze findings
   - Get guidance on follow-up care

3. **General Medical Reports**
   - Any PDF or image containing medical information
   - Comprehensive analysis with web-researched context
   - Department-specific recommendations

## Disclaimer
This tool is for informational purposes only and should not replace professional medical advice. Always consult with healthcare professionals for medical decisions.
