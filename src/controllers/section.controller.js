const logger = require('libs/logger')(module);
const Section = require('../models/section.model.js');
const CourseController = require('./course.controller.js');
// const errors = require('../utils/errors');

const create = async (sectionData) => {
  const {
    section,
    days,
    startTime,
    endTime,
    enrcap,
    instructor,
    venue,
    venueCap,
  } = sectionData;
  const course = await CourseController.create(sectionData);
  // Find duplicates
  const existing = await Section.findOne({
    course,
    sectionCode: section,
  });
  if (existing) {
    logger.info(`section exists: ${existing.sectionCode}`);
    return existing;
  }
  const sectionObj = new Section({
    course,
    sectionCode: section,
    days,
    startTime,
    endTime,
    enrcap,
    instructor,
    venue,
    venueCap,
  });
  await sectionObj.save();
  course.sections.push(sectionObj);
  await course.save();
  return sectionObj;
};


module.exports = {
  create,
};
