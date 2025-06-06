const express = require('express');
const router = express.Router();
const chapterController = require('../controllers/chapterController');
const adminAuth = require('../middleware/adminAuth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.get('/', chapterController.getChapters);
router.get('/:id', chapterController.getChapterById);
router.post('/', adminAuth, upload.single('file'), chapterController.uploadChapters);

module.exports = router;
