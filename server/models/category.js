const connection = require("../config/connection");
const sql = require("mssql");

class Category {
    constructor(category) {
        this.id = category.id;
        this.name = category.name;
    }

    static create(categoryObj) {
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    const pool = await sql.connect(connection);
                    const result = await pool.request()
                        .input('CategoryName', sql.NVarChar.categoryObj.name)
                        .query(`INSERT INTO bpCategory (CategoryName)
                        VALUES (@CategoryName);

                        SELECT * FROM bpCategory WHERE CategoryId = IDENT_CURRENT(bpCategory);
                        `);

                    if (!result.recordset[0])
                        throw {
                            status: 500,
                            message: 'Failed to save Category to database'
                        };

                    const record = result.recordset[0];
                    const newCategory = new Category({
                        id: record.id,
                        name: record.name
                    })

                    resolve(newCategory);

                } catch (error) {
                    console.log(err);
                    reject(err);
                }
                sql.close();
            })();
        })
    }

    static readAll() {
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    const pool = await sql.connect(connection);
                    const result = await pool.request()
                        .query(`SELECT * FROM bpCategory`);

                    if (result.recordset.length <= 0)
                        throw {
                            status: 404,
                            message: 'No categories found'
                        }

                    const categories = [];
                    result.recordset.forEach((record) => {
                        const categoryObj = {
                            id: record.id,
                            name: record.name
                        }

                        categories.push(new Category(categoryObj));
                    });

                    resolve(categories);
                } catch (err) {
                    console.log(err);
                    reject(err);
                }
                sql.close();
            })();
        })
    }

    static readById(categoryId) {
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    const pool = await sql.connect(connection);
                    const result = await pool.request()
                        .input('CategoryId', sql.Int, categoryId)
                        .query(`SELECT * FROM bpCategory WHERE CategoryId = @CategoryId`);

                    if (!result.recordset[0]) {
                        throw {
                            status: 500,
                            message: "Failed to get category",
                        };
                    }

                    const record = result.recordset[0];
                    const category = new Category({
                        id: record.CategoryId,
                        name: record.CategoryName
                    })

                    resolve(category)

                } catch (err) {
                    console.log(err);
                    reject(err);
                }

                sql.close();
            })()
        })
    }

    update(categoryObj) {
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    const pool = await sql.connect(connection);
                    const result = await pool.request()
                        .input('CategoryName', sql.NVarChar, categoryObj.name)
                        .query(`
                UPDATE bpCategory SET CategoryName = @CategoryName
                `)

                    if (!result.rowsAffected[0]) {
                        throw {
                            status: 500,
                            message: 'Failed to update category'
                        }
                    }

                    if (result.rowsAffected.length != 1) {
                        throw {
                            status: 500,
                            message: "Database is corrupt",
                        };
                    }

                    resolve();
                } catch (err) {
                    console.log(err);
                    reject(err);
                  }
                  sql.close();
            })()
        })
    }

    static delete(categoryId) {
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    const pool = await sql.connect;
                    const result = await pool.request()
                        .input('CategoryId', sql.Int, categoryId)
                        .query(`
                DELETE FROM bpCategory WHERE CategoryId = @CategoryId
                `)

                    resolve();
                } catch (err) {
                    console.log(err);
                    reject(err);
                }
                sql.close();

            })()
        })
    }
}

module.exports = Category;