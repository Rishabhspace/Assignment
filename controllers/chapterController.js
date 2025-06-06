const Chapter = require('../models/Chapter');
const fs = require('fs');
const redisClient = require('../config/redis');

// GET /api/v1/chapters
exports.getChapters = async (req, res) => {
  try {
    const { page = 1, limit = 10, class: classFilter, unit, status, weakChapters, subject } = req.query;
    const filter = {};
    if (classFilter) filter.class = classFilter;
    if (unit) filter.unit = unit;
    if (status) filter.status = status;
    if (weakChapters !== undefined) filter.weakChapters = weakChapters === 'true';
    if (subject) filter.subject = subject;

    const cacheKey = `chapters:${JSON.stringify(filter)}:page:${page}:limit:${limit}`;
    // Check Redis cache
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      return res.json(parsed);
    }

    const total = await Chapter.countDocuments(filter);
    const chapters = await Chapter.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const response = { total, chapters };
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(response)); // Cache for 1 hour
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/v1/chapters/:id
exports.getChapterById = async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id);
    if (!chapter) return res.status(404).json({ error: 'Chapter not found' });
    res.json(chapter);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/v1/chapters (Admin only)
exports.uploadChapters = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const fileData = fs.readFileSync(req.file.path, 'utf8');
    let chapters;
    try {
      chapters = JSON.parse(fileData);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid JSON file' });
    }
    if (!Array.isArray(chapters)) chapters = [chapters];
    const failed = [];
    const inserted = [];
    for (const chapter of chapters) {
      try {
        const newChapter = new Chapter(chapter);
        await newChapter.save();
        inserted.push(newChapter);
      } catch (err) {
        failed.push({ chapter, error: err.message });
      }
    }
    // Invalidate cache
    await redisClient.flushAll();
    res.json({ inserted: inserted.length, failed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
