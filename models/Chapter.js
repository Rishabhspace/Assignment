const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema(
  {
    subject: { type: String },
    chapter: { type: String, required: true },
    class: { type: String, required: true },
    unit: { type: String },
    yearWiseQuestionCount: { type: Object },
    questionSolved: { type: Number },
    status: { type: String },
    isWeakChapter: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chapter", chapterSchema);
