const express = require('express');
const router = express.Router();
const productService = require('../services/product.service');
const { MYSQL_DB } = require('../mysql/mysql')


// routes
router.post('/', createProduct);
router.get('/', getProduct);
router.get('/:url', getDetailProduct)
router.put('/:id', editProduct)
router.delete('/:id', deleteProduct)
router.get('/get', getData)
router.get('/variant/:id', getVariant)
router.post('/search', searchProduct)
router.post('/group', createGroup)
router.post('/group/delete', deleteGroup)
router.get('/search/:category', searchProductFromCateOrSub)


module.exports = router;

function createProduct(req, res, next) {
    productService.createProduct(req, res)
}

function getProduct(req, res, next) {
    productService.getProduct(req, res)
}

function editProduct(req, res, next) {
    productService.editProduct(req, res)
}

function deleteProduct(req, res, next) {
    productService.deleteProduct(req, res)
}

function getData(req, res, next) {
    MYSQL_DB.connect(err => {
        let sql = `
        SELECT product.*, category.name as main_category, subcategory.name as sub_category
        FROM product
        INNER JOIN category ON product.main_category = category.id
        INNER JOIN subcategory ON product.sub_category = subcategory.id
        WHERE product.main_category = category.id && product.sub_category = subcategory.id
        
        `
        MYSQL_DB.query(sql, (err, resutls) => {
            res.send(resutls)
    
        })    
    })
}

function getVariant(req, res, next) {
    productService.getVariant(req, res)
}

function searchProduct(req, res, next) {
    productService.searchProduct(req, res)
}

function createGroup(req, res, next) {
    productService.createGroup(req, res)
}

function deleteGroup(req, res, next) {
    productService.deleteGroup(req, res)
}

function searchProductFromCateOrSub(req, res, next) {
    productService.searchProductFromCateOrSub(req, res)
}

function getDetailProduct(req, res, next) {
    productService.getDetailProduct(req, res)
}