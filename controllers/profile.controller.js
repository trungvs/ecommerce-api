const express = require('express');
const router = express.Router();
const profileService = require('../services/profile.service');

// routes

router.get('/', getProfileInfomation)
router.post('/changeinfo', editProfileInformation)
router.post('/changepass', handleChangePass)

module.exports = router;

function getProfileInfomation(req, res, next) {
    profileService.getProfileInfomation(req, res)
}

function editProfileInformation(req, res, next) {
    profileService.editProfileInformation(req, res)
}

function handleChangePass(req, res, next) {
    profileService.handleChangePass(req, res)
}