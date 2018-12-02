const logger = require('libs/logger')(module);
const Course = require('../models/course.model.js');
// const errors = require('../utils/errors');

const create = async ({
  abbr,
  title,
  sections,
  creditsUS,
  credits,
  startDate,
  endDate,
}) => {
  // Find duplicates
  const foundCourse = await Course.findOne({
    abbr,
  });
  if (foundCourse) {
    logger.info(`course exists: ${foundCourse.abbr}`);
    return foundCourse;
  }
  // Create new Course
  const course = new Course({
    abbr,
    title,
    sections,
    creditsUS,
    credits,
    startDate,
    endDate,
  });
  await course.save();
  return course;
};

const getAll = async (_, res) => {
  const result = await Course.find().populate('sections');
  res.send(result);
};

module.exports = {
  getAll,
  create,
};
