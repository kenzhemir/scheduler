const mongoose = require('mongoose');
// const Course = require('./course.model');

const {
  Schema,
} = mongoose;

const sectionSchema = new Schema({
  course: {
    type: Schema.Types.ObjectId,
    ref: 'courses',
  },
  sectionCode: String,
  days: [String],
  startTime: String,
  endTime: String,
  enrcap: String,
  instructors: String,
  venue: String,
  venueCap: String,
});


const Section = mongoose.model('sections', sectionSchema);

module.exports = Section;
