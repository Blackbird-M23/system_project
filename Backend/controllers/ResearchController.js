const Research = require('../models/Research');

const ResearchController = {
    // Get all research papers
    getAllResearch: async (req, res) => {
        try {
            const research = await Research.find()
                .sort({ publishedDate: -1 }); // Sort by newest first
            res.json(research);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Add new research paper
    addResearch: async (req, res) => {
        try {
            const { title, link, category } = req.body;
            const newResearch = new Research({
                title,
                link,
                category
            });
            const savedResearch = await newResearch.save();
            res.status(201).json(savedResearch);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
};

module.exports = ResearchController; 