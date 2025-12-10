const fileService = require('../services/fileService');
const openaiService = require('../services/openaiService');

class SummaryController {
  async uploadAndSummarize(req, res) {
    let filePath = null;
    try {
      let text = '';
      
      if (req.file) {
        filePath = req.file.path;
        const fileType = req.file.mimetype;
        text = await fileService.extractText(filePath, fileType);
      } else if (req.body.text) {
        text = req.body.text;
      } else {
        return res.status(400).json({ success: false, error: 'No file or text provided' });
      }

      if (!text || !text.trim()) {
        return res.status(400).json({ success: false, error: 'No content to summarize' });
      }

      const summary = await openaiService.generateSummary(text);
      const originalLength = text.length;
      const summaryLength = summary.length;

      res.json({
        success: true,
        summary: summary,
        stats: {
          originalLength,
          summaryLength,
          reductionPercentage: Math.round((1 - summaryLength / originalLength) * 100),
          charactersSaved: originalLength - summaryLength
        },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Summary error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to generate summary',
        ...(process.env.NODE_ENV === 'development' && { details: error.message })
      });
    } finally {
      if (filePath) {
        try {
          await fileService.deleteFile(filePath);
        } catch (err) {
          console.warn('Cleanup failed:', err);
        }
      }
    }
  }

  async summarizeText(req, res) {
    try {
      const { text } = req.body;

      if (!text || !text.trim()) {
        return res.status(400).json({ success: false, error: 'Text is required' });
      }

      const summary = await openaiService.generateSummary(text);

      res.json({
        success: true,
        summary: summary,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Text summary error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to generate summary',
        ...(process.env.NODE_ENV === 'development' && { details: error.message })
      });
    }
  }
}

module.exports = new SummaryController();