const { MYSQL_DB } = require('../mysql/mysql')

module.exports = {
    homeContent,
    homeData
};

async function homeContent(res) {
    // MYSQL_DB.connect((err) => {
        let sql = 'SELECT * from banner';
        MYSQL_DB.query(sql, (err, banner) => {
            let sql = "SELECT * FROM category"
            MYSQL_DB.query(sql, (err, category) => {
                let sql = "SELECT * FROM product WHERE home_product = 1"
                MYSQL_DB.query(sql, (err, product) => {
                    res.send({
                        code: 200,
                        data: {
                            banner,
                            category,
                            product
                        }
                    })
                })
            })
        });
    // })
}


// Home Dashboard for Administration

function homeData(req, res) {
    let day = req.body.day
    day = day.split("/")
    day = `${day[2]}-${day[1]}-${day[0]}`

    let firstday = req.body.week.firstday
    firstday = firstday.split("/")
    firstday = `${firstday[2]}-${firstday[1].length === 1 ? "0" + firstday[1] : firstday[1]}-${firstday[0]}`

    let lastday = req.body.week.lastday
    lastday = lastday.split("/")
    lastday = `${lastday[2]}-${lastday[1].length === 1? "0" + lastday[1] : lastday[1]}-${lastday[0]}`

    // MYSQL_DB.connect((err) => {
        // All orders of today
        let sql = `
        SELECT 
        (SELECT COUNT(*) FROM orders WHERE created_at LIKE "%${day}%") AS ordersDay,
        (SELECT COUNT(*) FROM orders WHERE created_at BETWEEN "${firstday}" AND "${lastday}") AS ordersWeek,
        (SELECT SUM(totalPrice) FROM orders WHERE status_order = 1 AND (created_at BETWEEN "${firstday}" AND "${lastday}")) AS revenueWeek,
        (SELECT SUM(totalPrice) FROM orders WHERE status_order = 1 AND created_at LIKE "%${day}%") AS revenueDay
        `
        MYSQL_DB.query(sql, (err, ordersReport) => {
            if (err) {
                res.send({
                    code: 400,
                    message: "Thao tác không thành công"
                })
            } else {
                const past7Days = [...Array(7).keys()].map(index => {
                    const date = new Date();
                    date.setDate(date.getDate() - index);
                  
                    return date.toLocaleDateString();
                  });
                const past7DaysNew = [...Array(7).keys()].map(index => {
                let date = new Date();
                date.setDate(date.getDate() - index);
                
                date  = date.toLocaleDateString().split("/");
                return `${date[2]}-${date[1]}-${date[0]}`
                });
                let sql =
                `
                SELECT
                (SELECT COUNT(*) FROM orders WHERE created_at LIKE "%${past7DaysNew[6]}%") AS "${past7Days[6]}", 
                (SELECT COUNT(*) FROM orders WHERE created_at LIKE "%${past7DaysNew[5]}%") AS "${past7Days[5]}", 
                (SELECT COUNT(*) FROM orders WHERE created_at LIKE "%${past7DaysNew[4]}%") AS "${past7Days[4]}", 
                (SELECT COUNT(*) FROM orders WHERE created_at LIKE "%${past7DaysNew[3]}%") AS "${past7Days[3]}", 
                (SELECT COUNT(*) FROM orders WHERE created_at LIKE "%${past7DaysNew[2]}%") AS "${past7Days[2]}", 
                (SELECT COUNT(*) FROM orders WHERE created_at LIKE "%${past7DaysNew[1]}%") AS "${past7Days[1]}", 
                (SELECT COUNT(*) FROM orders WHERE created_at LIKE "%${past7DaysNew[0]}%") AS "${past7Days[0]}"
                `
                MYSQL_DB.query(sql, (err, ordersDetail) => {
                    if (err) {
                        res.send({
                            code: 400,
                            message: "Thao tác không thành công"
                        })
                    } else {
                        let sql =`
                        SELECT
                            (SELECT SUM(totalPrice) FROM orders WHERE created_at LIKE "%${past7DaysNew[6]}%" AND status_order = 1) AS "${past7Days[6]}", 
                            (SELECT SUM(totalPrice) FROM orders WHERE created_at LIKE "%${past7DaysNew[5]}%" AND status_order = 1) AS "${past7Days[5]}", 
                            (SELECT SUM(totalPrice) FROM orders WHERE created_at LIKE "%${past7DaysNew[4]}%" AND status_order = 1) AS "${past7Days[4]}", 
                            (SELECT SUM(totalPrice) FROM orders WHERE created_at LIKE "%${past7DaysNew[3]}%" AND status_order = 1) AS "${past7Days[3]}", 
                            (SELECT SUM(totalPrice) FROM orders WHERE created_at LIKE "%${past7DaysNew[2]}%" AND status_order = 1) AS "${past7Days[2]}", 
                            (SELECT SUM(totalPrice) FROM orders WHERE created_at LIKE "%${past7DaysNew[1]}%" AND status_order = 1) AS "${past7Days[1]}", 
                            (SELECT SUM(totalPrice) FROM orders WHERE created_at LIKE "%${past7DaysNew[0]}%" AND status_order = 1) AS "${past7Days[0]}"
                        `
                        MYSQL_DB.query(sql, (err, revenueDetail) => {
                            if (err) {
                                res.send({
                                    code: 400,
                                    message: "Thao tác không thành công"
                                })
                            } else {
                                res.send({
                                    code: 200,
                                    message: "Thao tác thành công",
                                    data: {
                                        ordersReport: ordersReport[0],
                                        ordersDetail: ordersDetail[0],
                                        revenueDetail: revenueDetail[0]
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    // })
}
