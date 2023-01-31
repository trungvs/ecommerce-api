const express = require('express');
const router = express.Router();
const bannerService = require('../services/banner.service');

// routes

router.get('/', getBanner)
router.post('/', addBanner)
router.put('/:id', editBanner)
router.delete('/:id', deleteBanner)

module.exports = router;

function getBanner(req, res, next) {
    bannerService.getBanner(res)
}

function addBanner(req, res, next) {
    bannerService.addBanner(req, res)
}

function editBanner(req, res, next) {
    bannerService.editBanner(req, res)
}

function deleteBanner(req, res, next) {
    bannerService.deleteBanner(req, res)
}