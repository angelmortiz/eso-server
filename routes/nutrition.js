const express = require('express');
const router = express.Router();

router.get('/food', (request, response, next) => {
    console.log('Getting food!');
    response.send();
});

router.post('/food', (request, response, next) => {
    console.log('Adding food!');
    response.send();
});

module.exports = router;
