var slugify = require('slugify')
const { v4: uuidv4 } = require("uuid")
const { MYSQL_DB } = require('../mysql/mysql')

module.exports = {
    getAllCategory,
    createCategory,
    deleteCategory,
    editCategory,
    addSubCategory,
    editSubCategory,
    deleteSubCategory,
    searchProductWithCate
};

// helper functions
function omitPassword(user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

function convertUrl(string) {
    return slugify(string, {
        lower: true,
        remove: /[*+~.()'"!:@]/
    })
}

function getAllCategory(res) {
    // MYSQL_DB.connect(err => {
        let sql = "SELECT * from category"
        MYSQL_DB.query(sql, (err, results1) => {
            let sql = "SELECT * from subcategory"
            MYSQL_DB.query(sql, (err, results2) => {
                res.send({
                    code: 200,
                    data: results1.concat(results2)
                })
            })
        })
    // })
}

function createCategory(req, res) {
    const id = uuidv4()
    const url = convertUrl(req.body.name)
    const name = req.body.name
    const image = req.body.image

    // MYSQL_DB.connect(err => {
        let sql = `
            INSERT INTO category(id, url, name, image)
            VALUES ("${id}", "${url}", "${name}", "${image}")
        `

        MYSQL_DB.query(sql, (err, results) => {
            if (err) {
                res.send({
                    code: 201,
                    message: "Thao tác không thành công"
                })
            } else {
                res.send({
                    code: 200,
                    message: "Thao tác thành công"
                })
            }
        })
    // })
}

function deleteCategory(req, res) {
    const categoryID = req.params.id
    // MYSQL_DB.connect(err => {
        let sql = `DELETE FROM category WHERE id = "${categoryID}"`
        MYSQL_DB.query(sql, (err, results) => {
            if (err) {
                res.send({
                    code: 201,
                    message: "Thao tác thất bại"
                })
            } else {
                res.send({
                    code: 200,
                    message: "Thao tác thành công"
                })
            }
        })
    // })
}

function editCategory(req, res) {
    const id = req.params.id
    const name = req.body.name
    const url = convertUrl(req.body.name)
    const image = req.body.image

    // MYSQL_DB.connect(err => {
        let sql = `
        UPDATE category
        SET name = "${name}", url = "${url}", image = "${image}"
        WHERE id = "${id}"
        `
        MYSQL_DB.query(sql, (err, results) => {
            if (err) {
                res.send({
                    code: 201,
                    message: "Thao tác không thành công"
                })
            } else {
                res.send({
                    code: 200,
                    message: "Thao tác thành công"
                })
            }
        })
    // })
}

function addSubCategory(req, res) {
    const id = uuidv4()
    const name = req.body.name
    const url = convertUrl(req.body.name)
    const image = req.body.image
    const main_category = req.body.main_category

    // MYSQL_DB.connect(err => {
        let sql = `
        INSERT INTO subcategory(id, url, name, main_category, image)
        VALUES ("${id}", "${url}", "${name}", "${main_category}", "${image}")`
        MYSQL_DB.query(sql, (err, results) => {
            if (err) {
                res.send({
                    code: 201,
                    message: "Thao tác không thành công"
                })
            } else {
                res.send({
                    code: 200,
                    message: "Thao tác thành công"
                })
            }
        })
    // })
}

function editSubCategory(req, res) {
    const id = req.params.id
    const name = req.body.name
    const url = convertUrl(req.body.name)
    const image = req.body.image
    const main_category = req.body.main_category

    // MYSQL_DB.connect(err => {
        let sql = `
        UPDATE subcategory
        SET name = "${name}", url = "${url}", image = "${image}", main_category = "${main_category}"
        WHERE id = "${id}"
        `
        MYSQL_DB.query(sql, (err, results) => {
            if (err) {
                res.send({
                    code: 201,
                    message: "Thao tác không thành công"
                })
            } else {
                res.send({
                    code: 200,
                    message: "Thao tác thành công",
                })
            }
        })
    // })
}

function deleteSubCategory(req, res) {
    const id = req.params.id
    // MYSQL_DB.connect(err => {
        let sql = `DELETE FROM subcategory WHERE id = "${id}"`
        MYSQL_DB.query(sql, (err, results) => {
            if (err) {
                res.send({
                    code: 201,
                    message: "Thao tác thất bại"
                })
            } else {
                res.send({
                    code: 200,
                    message: "Thao tác thành công"
                })
            }
        })
    // })
}

function searchProductWithCate(req, res) {
    const category = req.body.category
    const subcategory = req.body.subcategory

    if (category !== undefined) {
        // MYSQL_DB.connect(err => {
            const sql = `SELECT * FROM category WHERE url = "${category}"`
            MYSQL_DB.query(sql, (err, results) => {
                const categoryID = results[0].id
                const sql = `SELECT * FROM product WHERE main_category = "${categoryID}"`
                MYSQL_DB.query(sql, (err, products) => {
                    const sql = `SELECT * FROM subcategory WHERE main_category = "${categoryID}"`
                    MYSQL_DB.query(sql, (err, subcategory) => {
                        res.send({
                            code: 200,
                            message: "Thành công",
                            data: {
                                category: results,
                                subcategory: subcategory,
                                products: products
                            }
                        })
                    })
                })
            })
        // })
    }

    if (subcategory !== undefined) {
        // MYSQL_DB.connect(err => {
            const sql = `SELECT * FROM subcategory WHERE url = "${subcategory}"`
            MYSQL_DB.query(sql, (err, subcategory) => {
                const subcategoryID = subcategory[0].main_category
                const sql = `SELECT * FROM product WHERE sub_category = "${subcategory[0].id}"`
                MYSQL_DB.query(sql, (err, products) => {
                    const sql = `SELECT * FROM category WHERE id = "${subcategoryID}"`
                    MYSQL_DB.query(sql, (err, category) => {
                        res.send({
                            code: 200,
                            message: "Thành công",
                            data: {
                                category: category[0],
                                subcategory: subcategory[0],
                                products: products
                            }
                        })
                    })
                })
            })
        // })
    }


}