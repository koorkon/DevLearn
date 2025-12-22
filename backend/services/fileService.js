const fs = require('fs').promises;
const pdf = require('pdf-parse');

class FileService {
  async extractText(file) {
    if (!file) throw new Error("No file uploaded");

    try {
      const dataBuffer = await fs.readFile(file.path);
      
      // options to ensure we get all pages
      const options = {
        pagerender: function(pageData) {
          return pageData.getTextContent()
            .then(function(textContent) {
              return textContent.items.map(item => item.str).join(' ');
            });
        }
      };

      const data = await pdf(dataBuffer);
      
      if (!data.text || data.text.trim().length < 10) {
        throw new Error("Could not extract meaningful text from PDF. It might be an image-based PDF.");
      }

      return data.text;
    } catch (error) {
      throw new Error("Extraction failed: " + error.message);
    }
  }

  async deleteFile(filePath) {
    try {
      await fs.unlink(filePath);
    } catch (err) {
      console.error("Cleanup error:", err.message);
    }
  }
}

module.exports = new FileService();