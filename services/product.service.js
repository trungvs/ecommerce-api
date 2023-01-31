var slugify = require('slugify')
const { v4: uuidv4 } = require("uuid")
const { MYSQL_DB } = require('../mysql/mysql')

module.exports = {
    createProduct,
    getProduct,
    editProduct,
    deleteProduct,
    getVariant,
    searchProduct,
    createGroup,
    deleteGroup,
    searchProductFromCateOrSub,
    getDetailProduct
};

// helper functions
function omitPassword(user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

function convertUrl(string) {
    return slugify(string, {
        lower: true,
        remove: /[*+~.()'"!:@/]/
    })
}

function getProduct(req, res) {
    // MYSQL_DB.connect(err => {
        let sql = 
        `
        SELECT product.*, category.name as category_name, category.url as category_url, subcategory.name as subcategory_name, subcategory.url as subcategory_url
        FROM product
        INNER JOIN category ON product.main_category = category.id
        INNER JOIN subcategory ON product.sub_category = subcategory.id
        WHERE product.main_category = category.id && product.sub_category = subcategory.id
        `
        MYSQL_DB.query(sql, (err, resutls) => {
            if (err) {
                res.send({
                    code: 201,
                    message: "Không lấy được dữ liệu"
                })
            } else {
                res.send({
                    code: 200,
                    message: "Thành công",
                    data: resutls
                })
            }
        })
    // })
}

function createProduct(req, res) {
    const id = uuidv4()
    const url = convertUrl(req.body.name)
    const name = req.body.name
    const description = req.body.description
    const color = req.body.color
    const colorName = req.body.colorName
    const images = req.body.images
    const price = req.body.price
    const price_sale = req.body.price_sale
    const main_category = req.body.main_category
    const sub_category = req.body.sub_category
    const home_product = req.body.home_product
    const variants = req.body.variants

    console.log(variants)

    var variantQuery = variants.map(v => {
        return (
        [uuidv4(), id, v.size, Number(v.quantity)]
        )
    })
    // variantQuery = variantQuery.toString()
    // variantQuery = variantQuery.replace(/(^"|"$)/g, '')

    // MYSQL_DB.connect(err => {
        let sql = `
        INSERT INTO product(id, url, name, description, color, images, price, price_sale, main_category, sub_category, home_product)
        VALUES ("${id}", "${url}", "${name}", "${description}", ${color}, "${images}", ${price}, ${price_sale}, "${main_category}", "${sub_category}", ${home_product})
        `
        MYSQL_DB.query(sql, (err, resutls) => {
            if (err) {
                console.log(err)
                res.send({
                    code: 201,
                    message: "Thao tác không thành công",
                    data: variantQuery
                })
            } else {
                res.send({
                    code: 200,
                    message: "Thao tác thành công"
                })
            }
        })

        MYSQL_DB.query("INSERT INTO variants(id, product_id, size, quantity) VALUES ?", [variantQuery], (err, resutls) => {
            console.log(err)
        })
    // })
}

function editProduct(req, res) {
    const id = req.params.id
    const name = req.body.name
    const url = convertUrl(req.body.name)
    const description = req.body.description
    const color = req.body.color
    const images = req.body.images
    const price = req.body.price
    const price_sale = req.body.price_sale
    const main_category = req.body.main_category
    const sub_category = req.body.sub_category
    const home_product = req.body.home_product
    const variants = req.body.variants

    var old_variants = variants.filter(v => v.id.length === 36)
    var new_variants = variants.filter(v => v.id.length !== 36) || []

    // MYSQL_DB.connect(err => {
        let sql = `
            UPDATE product
            SET name = "${name}", url = "${url}", description = "${description}", color = ${color}, images = "${images}", price = ${price}, price_sale = ${price_sale}, main_category = "${main_category}", sub_category = "${sub_category}", home_product = ${home_product}
            WHERE id = "${id}"
        `
        MYSQL_DB.query(sql, (err, resutls) => {
            if (err) {
                res.send({
                    code: 201,
                    message: "Thao tác không thành công"
                })
            } else {
                res.send({
                    code: 200,
                    message: "Thao tác thành công",
                    data: old_variants
                })
            }
        })

        old_variants.map(v => {
            let sql = `
            UPDATE variants
            SET size = ${v.size}, quantity = ${v.quantity}
            WHERE id = "${v.id}"
            `
            MYSQL_DB.query(sql, (err, resutls) => {
                console.log(err)
            })
        })

        if (new_variants !== null) {
            new_variants = new_variants.map(v => {
                return (
                    [uuidv4(), id, v.size, v.quantity]
                )
            })
            let sql = "INSERT INTO variants(id, product_id, size, quantity) VALUES ?"
            MYSQL_DB.query(sql, [new_variants], (err, results) => {
                console.log(err)
            })
        }
    // })
}

function deleteProduct(req, res) {
    const id = req.params.id

    // MYSQL_DB.connect(err => {
        let sql = `DELETE FROM product WHERE id = "${id}"`
        MYSQL_DB.query(sql, (err, resutls) => {
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

function getVariant(req, res) {
    const id = req.params.id

    
    // MYSQL_DB.connect(err => {
        let sql = `
        SELECT * FROM variants WHERE product_id = "${id}"
        `
        MYSQL_DB.query(sql, (err, resutls) => {
            if (err) {
                res.send({
                    code: 201,
                    message: "Không lấy được danh sách Phân loại"
                })
            } else {
                res.send({
                    code: 200,
                    message: "Thao tác thành công",
                    data: resutls
                })
            }
        })
    // })
}

function searchProduct(req, res) {
    const main_category = req.body.category
    const sub_category = req.body.subCategory

    let sql = `
        SELECT * FROM product WHERE sub_category = "${sub_category}" && main_category = "${main_category}"
        `
        // MYSQL_DB.connect(err => {
            MYSQL_DB.query(sql, (err, results1) => {
                let sql = `
                    SELECT * FROM related_products WHERE subcategory = "${sub_category}"
                `
                MYSQL_DB.query(sql, (err, results2) => {
                    if (err) {
                        res.send({
                            code: 201,
                            message: "Thao tác thất bại"
                        })
                    } else {
                        res.send({
                            code: 200,
                            message: "Thao tác thành công",
                            data: results1.concat(results2)
                        })
                    }
                })
        // })
    })
}

function createGroup(req, res) {
    const id = uuidv4()
    const listGroup = req.body.listGroup || []
    const sub_category = req.body.subCategory

    // MYSQL_DB.connect(err => {
        MYSQL_DB.query(`INSERT INTO related_products(id, subcategory) VALUES ("${id}", "${sub_category}")`, (err, results) => {
            console.log(err)
        })
        listGroup.map(item => {
            let sql = `
                UPDATE product
                SET related_products = "${id}"
                WHERE id = "${item}"
            `
            MYSQL_DB.query(sql, (err, results) => {
                
            })
        })
        res.send({
            code: 200,
            message: "Thao tác thành công",
        })
    // })
}

function deleteGroup(req, res) {
    const listID = req.body.listID
    const listRelated = req.body.listRelated

    // MYSQL_DB.connect(err => {
        listID.map(item => {
            let sql = `
            UPDATE product
            SET related_products = ${null}
            WHERE id = "${item}"
            `
            MYSQL_DB.query(sql, (err, results) => {
                if (!err) {
                    
                }
                listRelated.map(i => {
                    let sql = `
                    SELECT * FROM product WHERE related_products = "${i}"
                    `
                    console.log(i)
                    MYSQL_DB.query(sql, (err, results) => {
                        console.log("results", results)
                        if (results.length === 0) {
                            let sql = `DELETE FROM related_products WHERE id = "${i}"`
                            console.log(sql)
                            MYSQL_DB.query(sql, (err, results) => {
                            })
                        } 
                    })
                })
            })
        })
        res.send({
            code: 200,
            message: "Thao tác thành công",
        })
    // })
    
    const listError = (err) => {
        console.log(err)
        // const checkError = Object.values(err).filter(e => e !== null)
        if (err) {
            res.send({
                code: 200,
                message: "Thao tác thành công",
            })
        } else {
            res.send({
                code: 201,
                message: "Thao tác thất bại"
            })
        }
    }
}

function searchProductFromCateOrSub(req, res) {
    const category = req.params.category

    // MYSQL_DB.connect(err => {
        let sql = `SELECT * FROM product WHERE url = "${category}"`
        MYSQL_DB.query(sql, (err, results) => {
            if (err) {
                res.send({
                    code: 200,
                    message: "Thao tác thành công",
                })
            } else {
                res.send({
                    code: 201,
                    message: "Thao tác thất bại",
                    data: results
                })
            }
        })
    // })
}

function getDetailProduct(req, res) {
    const url = req.params.url

    // MYSQL_DB.connect(err => {
        let sql = `SELECT * FROM product WHERE url = "${url}"`
        MYSQL_DB.query(sql, (err, product) => {
            let sql = `SELECT * FROM variants WHERE product_id = "${product[0].id}"`
            MYSQL_DB.query(sql, (err, variants) => {
                let sql = `SELECT * FROM product WHERE related_products = "${product[0].related_products}"`
                MYSQL_DB.query(sql, (err, related_products) => {
                    let sql = `SELECT * FROM subcategory WHERE id = "${product[0].sub_category}"`
                    MYSQL_DB.query(sql, (err, sub) => {
                        res.send({
                            code: 200,
                            message: "Thành công",
                            data: {
                                ...product[0],
                                variants: variants,
                                related_products_list: related_products,
                                sub_category: sub[0]
                            }
                        })
                    })
                })
            })
        })
    // })
}

