const mongoose = require('mongoose');
// const Section = require('./section.model');

const {
  Schema,
} = mongoose;

const courseSchema = new Schema({
  abbr: {
    type: String,
    unique: true,
  },
  code: Number,
  title: String,
  sections: [{
    type: Schema.Types.ObjectId,
    ref: 'sections',
  }],
  creditsUS: Number,
  credits: Number,
  startDate: String,
  endDate: String,
});

const Course = mongoose.model('courses', courseSchema);

module.exports = Course;
