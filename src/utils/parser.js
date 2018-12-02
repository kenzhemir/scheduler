const pdf = require('pdf-parse');
const fs = require('fs');
const logger = require('libs/logger')(module);
const sectionController = require('../controllers/section.controller');

function convertTo24(time) {
  let hours = Number(time.match(/^(\d+)/)[1]);
  const minutes = Number(time.match(/:(\d+)/)[1]);
  const AMPM = time.match(/\s(.*)$/)[1];
  if (AMPM === 'PM' && hours < 12) hours += 12;
  if (AMPM === 'AM' && hours === 12) hours -= 12;
  let sHours = hours.toString();
  let sMinutes = minutes.toString();
  if (hours < 10) sHours = `0${sHours}`;
  if (minutes < 10) sMinutes = `0${sMinutes}`;
  return `${sHours}:${sMinutes}`;
}


async function parseFile(filename) {
  const dataBuffer = fs.readFileSync(filename);
  return pdf(dataBuffer).then((data) => {
    const text = data.text.split('DateDaysTimeEnrCapFacultyRoom\n')[1].replace(/\n/g, '|');
    const rawArray = text.match(/(.+?(?=cap:)cap:.+?\|)/g);
    const result = rawArray.map((item) => {
      const parsedArray = item.match(/([A-Z]{3,5} [\d]\w+)\|?([A-Z][a-z]{2}.*)(\d\d?.\d)(\d\d?)(\d\d-\w\w\w-\d\d)(\d\d-\w\w\w-\d\d)([ MTWRFSU]+)(\d\d:\d\d (?:P|A)M)-(\d\d:\d\d (?:P|A)M)([\d]+)(.*)(\d\d?E?\.\d+).*(cap:\d+)/);
      if (parsedArray == null) {
        return item;
      }
      const codeMatch = parsedArray[1].match(/([A-Z]{3,5} [\d]{3})(\d*\w+)/);
      return {
        abbr: codeMatch[1],
        section: codeMatch[2],
        title: parsedArray[2].replace(/\|/g, ' '),
        creditsUS: parsedArray[3],
        credits: parsedArray[4],
        startDate: parsedArray[5],
        endDate: parsedArray[6],
        days: parsedArray[7].split(' '),
        startTime: convertTo24(parsedArray[8]),
        endTime: convertTo24(parsedArray[9]),
        enrcap: parsedArray[10],
        instructor: parsedArray[11].replace(/\|/g, ' '),
        venue: parsedArray[12],
        venueCap: parsedArray[13].substr(4),
      };
    });
    return result;
  });
}

async function uploadDataToDatabase(filename) {
  const results = await parseFile(filename);
  for (res of results) {
    if (res.section) {
      await sectionController.create(res);
    }
  }
  // results.forEach(async (res) => {

  // });
}

module.exports = {
  parseFile,
  uploadDataToDatabase,
};
