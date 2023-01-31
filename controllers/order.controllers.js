const express = require('express');
const router = express.Router();
const cartService = require('../services/order.services');

router.post('/getAllOrder', getAllOrder)
router.post('/updateOrderStatus', updateOrderStatus)
router.get('/:id', getOrder)

module.exports = router;

function getAllOrder(req, res, next) {
    cartService.getAllOrder(req, res)
}

function updateOrderStatus(req, res, next) {
    cartService.updateOrderStatus(req, res)
}

function getOrder(req, res, next) {
    cartService.getOrder(req, res)
}