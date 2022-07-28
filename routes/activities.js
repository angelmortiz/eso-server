const express = require('express');
const router = express.Router();

router.get('/exercise', (request, response, next) => {
    console.log('Getting exercise!');
    response.send();
});

router.post('/exercise', (request, response, next) => {
    console.log('Adding exercise!');
    response.send();
});

module.exports = router;