const { v4: uuidv4 } = require("uuid")
const { MYSQL_DB } = require('../mysql/mysql')

// MYSQL_DB.connect(function(err) {
//     if (err) {
//         console.log("loi")
//     } else {
//         console.log("connected")
//     }
// })
MYSQL_DB.query("SELECT COUNT(*) FROM orders", (err, results) => {
    if (err) {
        console.log(err)
    } else {
        console.log(results)
    }
})

module.exports = {
    getBanner,
    addBanner,
    editBanner,
    deleteBanner
};

// helper functions
function omitPassword(user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

function getBanner(res) {
    // MYSQL_DB.connect((err) => {
        let sql = 'SELECT * from banner'
        MYSQL_DB.query(sql, (err, results) => {
            if (err) {
                res.send({
                    code: 201,
                    message: "Không lấy được dữ liệu"
                })
            } else {
                res.send({
                    code: 200,
                    message: "Thành công",
                    data: results
                })
            }
        })
    // })
}

function addBanner(req, res) {
    const id = uuidv4()
    const url = req.body.url
    const name = req.body.name
    const img = req.body.img || ''
    const img_mobile = req.body.img_mobile || ''

    // MYSQL_DB.connect(err => {
        let sql = `
            INSERT INTO banner(id, url, name, img, img_mobile)
            VALUES ("${id}", "${url}", "${name}", "${img}", "${img_mobile}")
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

function editBanner(req, res) {
    const id = req.params.id
    const url = req.body.url
    const name = req.body.name
    const img = req.body.img || ''
    const img_mobile = req.body.img_mobile || ''

    // MYSQL_DB.connect(err => {
        let sql = `
            UPDATE banner
            SET url = "${url}", name = "${name}", img = "${img}", img_mobile = "${img_mobile}"
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

function deleteBanner(req, res) {
    const id = req.params.id
    // MYSQL_DB.connect(err => {
        let sql = `DELETE FROM banner WHERE id = "${id}"`
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

