const express = require('express');
const router = express.Router();
const homeServices = require('../services/home.services');


// routes
router.get('/', homeContent);
router.post('/dashboard', homeData);

module.exports = router;

function homeContent(req, res) {
    homeServices.homeContent(res)
}

function homeData(req, res) {
    homeServices.homeData(req, res)
}

