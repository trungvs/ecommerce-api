const { MYSQL_DB } = require('../mysql/mysql')

module.exports = {
    getAllOrder,
    updateOrderStatus,
    getOrder
}

function getAllOrder(req, res) {
    const list = req.body.list
    const orderID = req.body.orderID
    const phone = req.body.phone
    const status = req.body.status
    let today = new Date().toLocaleDateString("vi-VN", {day: "2-digit", month: "2-digit", year: "numeric"}).split("/")
    today = `${today[2]}-${today[1]}-${today[0]}`

    if (list === 1) {
        // MYSQL_DB.connect(err => {
            let sql = `
            SELECT * FROM orders
            WHERE ${orderID === null || orderID === "" ? `id != ""` : `id LIKE "%${orderID}%"`} AND ${phone === null || phone === "" ? `phone != ""` : `phone LIKE "%${phone}%"`} ${status === 3 ? "" : `AND status_order = ${status}`}
            ORDER BY created_at DESC
            `
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
    if (list === 2) {
        // MYSQL_DB.connect(err => {
            let sql = `
            SELECT * FROM orders
            WHERE ${orderID === null ? `id != ""` : `id = "${orderID}"`} AND ${phone === null || phone === "" ? `phone != ""` : `phone = ${phone}`} ${status === 3 ? "" : `AND status_order = ${status}`} AND created_at LIKE "%${today}%"
            ORDER BY created_at DESC
            `
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
    if (list === 3) {
        let curr = new Date();
        let firstday = new Date(
        curr.setDate(curr.getDate() - curr.getDay() + 1)
        ).toLocaleDateString('vi-vn', { timeZone: 'Asia/Ho_Chi_Minh' });
        firstday = firstday.split("/")
        firstday = `${firstday[2]}-${firstday[1]}-${firstday[0]}`
        let lastday = new Date(curr.setDate(curr.getDate() - curr.getDay() + 7))
        .toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })
        lastday = lastday.split("/")
        lastday = `${lastday[2]}-${lastday[1]}-${lastday[0]}`
        // MYSQL_DB.connect(err => {
            let sql = `
            SELECT * FROM orders
            WHERE ${orderID === null || orderID === "" ? `id != ""` : `id LIKE "%${orderID}%"`} AND ${phone === null || phone === "" ? `phone != ""` : `phone LIKE "%${phone}%"`} ${status === 3 ? "" : `AND status_order = ${status}`} AND created_at >= "${firstday}" AND created_at <= "${lastday}"
            ORDER BY created_at DESC
            `
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
    if (list === 4) {
        let curr = new Date().toLocaleDateString()
        curr = curr.split("/")
        curr = `${curr[2]}-${curr[1]}`
        // MYSQL_DB.connect(err => {
            let sql = `
            SELECT * FROM orders
            WHERE ${orderID === null || orderID === "" ? `id != ""` : `id LIKE "%${orderID}%"`} AND ${phone === null || phone === "" ? `phone != ""` : `phone LIKE "%${phone}%"`} ${status === 3 ? "" : `AND status_order = ${status}`} AND created_at LIKE "%${curr}%"
            ORDER BY created_at DESC
            `
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
}

function updateOrderStatus(req, res) {
    const id = req.body.id
    const status = req.body.status
    const issue = req.body.issue || ""

    if (status === 2) {
        // MYSQL_DB.connect(err => {
            let sql = `
            UPDATE orders
            SET status_order = ${status} ${status === 2 ? `, issue = "${issue}"` : ""}
            WHERE id = "${id}"
            `
            MYSQL_DB.query(sql, (err, results) => {
                if (err) {
                    res.send({
                        code: 400,
                        message: "Thao tác không thành công"
                    })
                } else {
                    let sql = `SELECT * FROM orders WHERE id = ${id}`
                    MYSQL_DB.query(sql, (err, results) => {
                        if (err) {
                            res.send({
                                code: 400,
                                message: "Thao tác không thành công"
                            })
                        } else {
                            let newData = []
                            JSON.parse(results[0].listItems).map(i => newData += ` (product_id = "${i.id}" AND size = ${i.size}) OR`)
                            newData = newData.replace(/..$/, "").split()[0]
                            let sql =`
                            UPDATE variants
                            SET quantity = quantity + 1
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
                                    })
                                }
                            })
                        }
                    })
                }
            })
        // })
    } else {
        // MYSQL_DB.connect(err => {
            let sql = `
            UPDATE orders
            SET status_order = ${status} ${status === 2 ? `, issue = "${issue}"` : ""}
            WHERE id = "${id}"
            `
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
                    })
                }
            })
        // })
    }
}

function getOrder(req, res) {
    const id = req.params.id
    // MYSQL_DB.connect(err => {
        let sql = `SELECT * FROM orders WHERE id = "${id}"`
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
                    data: results[0]
                })
            }
        })
    // })
}
