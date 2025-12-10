const fs = require('fs').promises;
const path = require('path');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');

class FileService {
  constructor() {
    this.uploadsDir = path.join(__dirname, '../uploads');
    this.ensureUploadsDir();
  }

  async ensureUploadsDir() {
    try {
      await fs.mkdir(this.uploadsDir, { recursive: true });
    } catch (error) {
      console.error('Error creating uploads directory:', error);
    }
  }

  async extractText(filePath, fileType) {
    try {
      switch (fileType) {
        case 'text/plain':
          const textContent = await fs.readFile(filePath, 'utf-8');
          return textContent;
        
        case 'application/pdf':
          const dataBuffer = await fs.readFile(filePath);
          const pdfData = await pdf(dataBuffer);
          return pdfData.text;
        
        case 'application/msword':
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          const docResult = await mammoth.extractRawText({ path: filePath });
          return docResult.value;
        
        default:
          throw new Error('Unsupported file type');
      }
    } catch (error) {
      console.error('File extraction error:', error);
      throw new Error('Failed to extract text from file');
    }
  }

  async deleteFile(filePath) {
    try {
      await fs.unlink(filePath);
      console.log('File deleted:', filePath);
    } catch (error) {
      console.warn('Error deleting file:', error.message);
    }
  }

  async getFileStats(filePath) {
    return fs.stat(filePath);
  }
}

module.exports = new FileService();