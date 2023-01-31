const { SQL_SERVER } = require('../mysql/mysql')

module.exports = getNameUrlCategory

function getNameUrlCategory(data) {
    let id_category = data.main_category
    let sql = `
        SELECT id, name, url
        FROM category
        WHERE id = "${id_category}"
    `
    SQL_SERVER.query(sql, (err, results) => {
        if (err) {
            returnData(err)
        } else {
            returnData(results)
        }
    })

    function returnData(results) {
        return results
    }

    console.log("Aa")

}

getNameUrlCategory({main_category: "getNameUrlCategory"})