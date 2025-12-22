const aiService = require('../services/aiService');
const fileService = require('../services/fileService');

const uploadAndSummarize = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded." });
    
    const text = await fileService.extractText(req.file); 
    const summary = await aiService.generateSummary(text); 
    
    if (req.file.path) await fileService.deleteFile(req.file.path);

    res.json({ success: true, summary });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { uploadAndSummarize };