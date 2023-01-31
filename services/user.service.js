const config = require('config.json');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require("uuid")
const { MYSQL_DB } = require('../mysql/mysql')

module.exports = {
    authenticate,
    getAll,
    getBanner,
    checktoken,
    signup,
    logout,
    deleteUser
};

// helper functions
function omitPassword(user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

function checktoken(req, res) {
    jwt.verify(req.body.access_token, config.secret, (err, decoded) => {
        if (err) {
            res.send({
                code: 498,
                message: "Invalid Token"
            })
        } else {
            res.send({
                code: 200,
                message: "Valid Token"
            })
        }
    })
}

async function authenticate({ username, password }, res) {
    // MYSQL_DB.connect((err) => {
        let sql = "SELECT * from user"
        MYSQL_DB.query(sql, (err, results) => {
            const user = results.find(u => u.username === username && u.password === password)
            if (user) {
                const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: '1d' });
                res.send({
                    code: 200,
                    data: {
                        ...omitPassword(user),
                        token
                    },
                    message: "Đăng nhập Thành công"
                })
            } else {
                res.send({
                    code: 400,
                    data: "",
                    message: "Tài khoản hoặc Mật khẩu không chính xác"
                })
            }
        })
    // })
}

function getBanner(res) {
    // MYSQL_DB.connect((err) => {
        let sql = 'SELECT * from banner'
        MYSQL_DB.query(sql, (err, results) => {
            res.send(results)
        })
    // })
}

async function getAll(res) {
    // MYSQL_DB.connect((err) => {
        let sql = "SELECT * from user"
        MYSQL_DB.query(sql, async (err, results) => {
            const users = await results.map(user => {
                return omitPassword(user)
            })
            res.send({
                code: 200,
                data: users
            })
        })
    // })
}

function signup(req, res) {
    let id = uuidv4()
    let username = req.body.username
    let phone = req.body.phone
    let password = req.body.password
    let email = req.body.email
    let fullname = req.body.fullname || ""
    let birthday = req.body.birthday || ""
    let detailAddress = req.body.detailAddress || ""
    let province = req.body.province || ""
    let district = req.body.district || ""
    let ward = req.body.ward || ""

    // MYSQL_DB.connect((err) => {
        let sql = "SELECT username, email from user"
        MYSQL_DB.query(sql, (err, results) => {
            if (!err) {
                const user = results.find(u => u.username === req.body.username || u.email === req.body.email)
                console.log(results)
                console.log(user)
                if (user) {
                    res.send({
                        code: 400,
                        data: "",
                        message: "Tài khoản hoặc Email đã được sử dụng"
                    })
                } else {
                    let sql = `INSERT INTO user (
                        id, username, phone, password, email, fullname, birthday, detailAddress, province, district, ward
                    ) VALUES (
                        '${id}',
                        '${username}',
                        '${phone}',
                        '${password}',
                        '${email}',
                        "${fullname}",
                        "${birthday}",
                        "${detailAddress}",
                        "${province}",
                        "${district}",
                        "${ward}"
                    )`
                    MYSQL_DB.query(sql, (err, results) => {
                        console.log(err)
                        console.log(sql)
                        if (err) {
                            res.send({
                                code: 204,
                                message: "Có lỗi, xin vui lòng thử lại"
                            })
                        } else {
                            res.send({
                                code: 200,
                                message: "Đăng ký thành công"
                            })
                        }
                    })
                }
            } else {
                throw err
            }
        })
    // })
}

function logout(req, res) {
    const token = req.headers.authorization
    jwt.destroy(token)
    res.send({
        code: 200,
        message: "Đăng xuất thành công"
    })
}

function deleteUser(req, res) {
    const id = req.params.id

    // MYSQL_DB.connect(err => {
        let sql = `DELETE FROM user WHERE id = "${id}"`
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