const jwtDecode = require('jwt-decode')
const config = require('config.json');
const { MYSQL_DB } = require('../mysql/mysql')

module.exports = {
    getProfileInfomation,
    editProfileInformation,
    handleChangePass,
};

function getProfileInfomation(req, res) {
    let userID = jwtDecode(req.headers.authorization).sub
    // MYSQL_DB.connect(err => {
        let sql = `SELECT * from user WHERE id = '${userID}'`
        MYSQL_DB.query(sql, (err, results) => {
            if (results[0].id == config.adminID) {
                res.send({
                    code: 200,
                    data: {
                        ...omitPassword(results[0]),
                        role: 'admin'
                    }
                })
            } else {
                res.send({
                    code: 200,
                    data: omitPassword(results[0]),
                })
            }
        })
    // })
}

function editProfileInformation(req, res) {
    let userID = req.body.id
    let email = req.body.email
    let phone = req.body.phone
    let fullname = req.body.fullname || ''
    let birthday = req.body.birthday || ''
    let province = req.body.province || ''
    let district = req.body.district || ''
    let ward = req.body.ward || ''
    let detailAddress = req.body.detailAddress || ''

    if (email == undefined || email.trim().length === 0 || phone === '0000000000') {
        res.send({
            code: 201,
            message: "Email hoặc Số điện thoại không được để trống"
        })
    } else {
        // MYSQL_DB.connect(err => {
            let sql = "SELECT id FROM user"
            MYSQL_DB.query(sql, (err, results) => {
                if (results.find(u => u.id === userID)) {
                    let sql = `
                    UPDATE user
                    SET email = "${email}", phone = "${phone}", fullname = "${fullname}", birthday = "${birthday}", province = "${province}", district = "${district}", ward = "${ward}", detailAddress = "${detailAddress}"
                    WHERE id = "${userID}"
                    `
                    MYSQL_DB.query(sql, (err, results) => {
                        if (err) {
                            console.log(err)
                        } else {
                            res.send({
                                code: 200,
                                message: "Thay đổi thông tin thành công"
                            })
                        }
                    })
                } else {
                    res.send({
                        code: 400,
                        message: "User không tồn tại"
                    })
                }
            })
        // })
    }
}

function handleChangePass(req, res) {
    let userID = jwtDecode(req.headers.authorization).sub
    let oldPass = req.body.oldPass
    let newPass = req.body.newPass || ''

    // MYSQL_DB.connect(err => {
        let sql = "SELECT * FROM user"
        MYSQL_DB.query(sql, (err, results) => {
            let user = results.find(u => u.id === userID)
            if (user) {
                if (user.password === oldPass) {
                    if (newPass.length === 0 ) {
                        res.send({
                            code: 403,
                            message: "Mật khẩu mới không được để trống"
                        })
                    } else {
                        let sql = `
                            UPDATE user
                            SET password = "${newPass}"
                            WHERE id = "${userID}"
                        `
                        MYSQL_DB.query(sql, (err, results) => {
                            if (err) {
                                res.send({
                                    code: 400,
                                    message: "Thay đổi mật khẩu không thành công"
                                })
                            } else {
                                res.send({
                                    code: 200,
                                    message: "Thay đổi mật khẩu thành công"
                                })
                            }
                        })
                    }
                } else {
                    res.send({
                        code: 403,
                        message: "Mật khẩu cũ không chính xác"
                    })
                }
            } else {
                res.send({
                    code: 400, 
                    message: "User không tồn tại"
                })
            }
        })
    // })
}

// helper functions
function omitPassword(user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

