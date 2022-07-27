const express = require('express');
const router = express.Router();

router.get('/exercise', (request, response, next) => {
    console.log('Getting exercise!');
});

router.post('/exercise', (request, response, next) => {
    console.log('Adding exercise!');
});

module.exports = router;