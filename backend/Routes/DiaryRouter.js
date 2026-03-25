const router = require('express').Router();
const { getEntries, addEntry, updateEntry, deleteEntry } = require('../Controllers/DiaryController');

router.get('/', getEntries);
router.post('/', addEntry);
router.put('/:id', updateEntry);
router.delete('/:id', deleteEntry);

module.exports = router;