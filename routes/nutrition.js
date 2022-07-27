const express = require('express');
const router = express.Router();

router.get('/food', (request, response, next) => {
    console.log('Getting food!');
});

router.post('/food', (request, response, next) => {
    console.log('Adding food!');
});

module.exports = router;
