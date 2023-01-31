const express = require('express');
const router = express.Router();
const categoryService = require('../services/category.service');

// routes
router.get('/', getAllCategory);
router.post('/', createCategory);
router.delete('/:id', deleteCategory);
router.put('/:id', editCategory)
router.post('/sub', addSubCategory)
router.put('/sub/:id', editSubCategory)
router.delete('/sub/:id', deleteSubCategory)
router.post('/search', searchProductWithCate)


module.exports = router;

function getAllCategory(req, res, next) {
    categoryService.getAllCategory(res)
}

function createCategory(req, res, next) {
    categoryService.createCategory(req, res)
}

function deleteCategory(req, res, next) {
    categoryService.deleteCategory(req, res)
}

function editCategory(req, res, next) {
    categoryService.editCategory(req, res)
}

function addSubCategory(req, res, next) {
    categoryService.addSubCategory(req, res)
}

function editSubCategory(req, res, next) {
    categoryService.editSubCategory(req, res)
}

function deleteSubCategory(req, res, next) {
    categoryService.deleteSubCategory(req, res)
}

function searchProductWithCate(req, res, next) {
    categoryService.searchProductWithCate(req, res)
}