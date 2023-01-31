const { MYSQL_DB } = require('../mysql/mysql')
const jwtDecode = require('jwt-decode')


module.exports = {
    getProductFromCart,
    addOrder,
    getOrderOfUser,
}

function getProductFromCart(req, res) {
    const cartList = req.body.cartList

    // MYSQL_DB.connect(err => {
        let sql = `SELECT * FROM product WHERE id IN (${MYSQL_DB.escape(cartList)})`
        MYSQL_DB.query(sql, (err, results) => {
            res.send({
                code: 200,
                message: "Thao tác thành công",
                data: results
            })
        })

    // })
}

function addOrder(req, res) {
    const id = Math.floor(Math.random() * 1000000000)
    const user_id = req.body.user_id || null
    const fullname = req.body.fullname
    const phone = req.body.phone
    const email = req.body.email
    const address = req.body.address
    const totalItem = req.body.totalItem
    const totalPrice = req.body.totalPrice
    const listItems = JSON.stringify(req.body.listItems) || []
    const status_order = req.body.status_order || 0
    const status_payment = req.body.status_payment || 0
    const payment = req.body.payment
    const note = req.body.note || ""
    const created_at = req.body.created_at

    if (listItems === [] || listItems.length === 0) {
        res.send({
            code: 201,
            message: "Chưa có sản phẩm trong giỏ hàng"
        })
    } else {
        let newData = []
        req.body?.listItems.map(i => newData += ` (product_id = "${i.id}" AND size = ${i.size}) OR`)
        newData = newData.replace(/..$/, "").split()[0]
        // MYSQL_DB.connect(err => {
            let sql = `SELECT * FROM variants WHERE ${newData}`
            MYSQL_DB.query(sql, (err, results) => {
                console.log(sql)
                if (err) {
                    res.send({
                        code: 400,
                        message: "Thao tác không thành công"
                    })
                } else {
                    if (results.map(i => i.quantity).includes(0)) {
                        res.send({
                            code: 201,
                            message: "Có sản phẩm đã hết hàng, vui lòng kiểm tra lại giỏ hàng"
                        })
                    } else {
                        // MYSQL_DB.connect(err => {
                            let sql =
                            `
                            INSERT INTO orders(id, user_id, fullname, phone, email, address, totalItem, totalPrice, listItems, status_order, status_payment, payment, note)
                            VALUES ("${id}", ${user_id ? `"${user_id}"` : null}, "${fullname}", ${phone}, "${email}",
                            "${address}", ${totalItem}, ${totalPrice}, '${listItems}' , ${status_order}, ${status_payment}, ${payment}, "${note}")
                            `
                            MYSQL_DB.query(sql, (err, results) => {
                                if (err) {
                                    res.send({
                                        code: 201,
                                        message: "Thao tác không thành công",
                                    })
                                } else {
                                    let sql = `
                                    UPDATE variants
                                    SET quantity = quantity - 1
                                    WHERE ${newData}
                                    `
                                    MYSQL_DB.query(sql, (err, results) => {
                                        if (err) {
                                            res.send({
                                                code: 400,
                                                message: "Thao tác không thành công",
                                            })
                                        } else {
                                            res.send({
                                                code: 200,
                                                message: "Thao tác thành công",
                                                data: {
                                                    code: id
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        // })
                    }
                }
            })
        // })
    }
}

function getOrderOfUser(req, res) {
    let userID = jwtDecode(req.headers.authorization).sub
    // MYSQL_DB.connect(err => {
        let sql = `SELECT * FROM orders WHERE user_id = "${userID}" ORDER BY created_at DESC`
        MYSQL_DB.query(sql, (err, results) => {
            if (err) {
                res.send({
                    code: 400,
                    message: "Thao tác không thành công"
                })
            } else {
                res.send({
                    code: 200,
                    message: "Thao tác thành công",
                    data: results
                })
            }
        })
    // })
}
