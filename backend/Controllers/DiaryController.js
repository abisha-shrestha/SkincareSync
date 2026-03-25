const DiaryEntry = require('../Models/Diary');

const getEntries = async (req, res) => {
    try {
        const { userEmail } = req.query;
        const entries = await DiaryEntry.find({ userEmail }).sort({ date: -1 });
        res.json({ success: true, entries });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const addEntry = async (req, res) => {
    try {
        const { userEmail, date, condition, products, notes } = req.body;
        const existing = await DiaryEntry.findOne({ userEmail, date });
        if (existing) {
            return res.status(400).json({ success: false, message: 'An entry for this date already exists' });
        }
        const entry = await DiaryEntry.create({ userEmail, date, condition, products, notes });
        res.json({ success: true, entry });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const updateEntry = async (req, res) => {
    try {
        const { id } = req.params;
        const { condition, products, notes } = req.body;
        const entry = await DiaryEntry.findByIdAndUpdate(
            id,
            { condition, products, notes },
            { new: true }
        );
        if (!entry) return res.status(404).json({ success: false, message: 'Entry not found' });
        res.json({ success: true, entry });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const deleteEntry = async (req, res) => {
    try {
        const { id } = req.params;
        await DiaryEntry.findByIdAndDelete(id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { getEntries, addEntry, updateEntry, deleteEntry };