const express = require('express');
const router = express.Router();
const userService = require('../services/user.service');

// routes
router.post('/authenticate', authenticate);
router.get('/', getAll);
router.delete('/:id', deleteUser);
router.get('/banner', getBanner);
router.post('/checktoken', checkToken)
router.post('/signup', signup)
router.get('/logout', logout)

module.exports = router;

function authenticate(req, res, next) {
    userService.authenticate(req.body, res)
}

function getAll(req, res, next) {
    userService.getAll(res)
}

function getBanner(req, res, next) {
    userService.getBanner(res)
}

function checkToken(req, res, next) {
    userService.checktoken(req, res)
}

function signup(req, res, next) {
    userService.signup(req, res)
}

function logout(req, res, next) {
    userService.logout(req, res)
}

function deleteUser(req, res, next) {
    userService.deleteUser(req, res)
}