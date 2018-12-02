const express = require('express');
// const fs = require('fs');
// const logger = require('libs/logger')(module);
const {
  uploadDataToDatabase,
} = require('../utils/parser');

const courseController = require('../controllers/course.controller.js');

const router = express.Router();
router.get('/', (req, res) => {
  uploadDataToDatabase('./test.pdf');
  res.send('done');
});
router.get('/all', courseController.getAll);
// router.use('/users', require('./user.route'));

module.exports = router;
