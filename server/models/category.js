const connection = require("../config/connection");
const sql = require("mssql");

class Category {
  constructor(category) {
    this.id = category.id;
    this.name = category.name;
    this.estimation = category.estimation ? category.estimation : 0;
  }

  static create(containerId, categoryObj) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const pool = await sql.connect(connection);
          const result = await pool
            .request()
            .input("ContainerId", sql.Int, containerId)
            .input("CategoryName", sql.NVarChar, categoryObj.name)
            .input("CategoryEstimation", sql.Int, categoryObj.estimation)
            .query(`
                        INSERT INTO bpCategory (CategoryName)
                        VALUES (@CategoryName);

                        INSERT INTO bpContainerCategory (ContainerId,CategoryId, CategoryEstimation) VALUES (@ContainerId, IDENT_CURRENT('bpCategory'), @CategoryEstimation)

                        SELECT bpCategory.CategoryId, bpCategory.CategoryName, bpContainerCategory.ContainerId, bpContainerCategory.CategoryEstimation
                        FROM bpCategory
                        INNER JOIN bpContainerCategory
                        ON bpCategory.CategoryId = bpContainerCategory.CategoryId
                        WHERE bpCategory.CategoryId = IDENT_CURRENT('bpCategory');
                        `);

          if (!result.recordset[0])
            throw {
              status: 500,
              message: "Failed to save Category to database",
            };

          const record = result.recordset[0];

          const newCategory = new Category({
            id: record.CategoryId,
            name: record.CategoryName,
            estimation: record.CategoryEstimation,
          });

          resolve(newCategory);
        } catch (err) {
          console.log(err);
          reject(err);
        }
        // sql.close();
      })();
    });
  }

  static readAll(containerId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const pool = await sql.connect(connection);
          const result = await pool
            .request()
            .input("ContainerId", sql.Int, containerId).query(`
                        SELECT bpCategory.CategoryId, bpCategory.CategoryName, bpContainerCategory.CategoryEstimation FROM bpCategory
                        INNER JOIN bpContainerCategory
                        ON bpContainerCategory.CategoryId = bpCategory.CategoryId
                        WHERE bpContainerCategory.ContainerId = @ContainerId;
                        `);

          if (result.recordset.length <= 0)
            throw {
              status: 404,
              message: "No categories found",
            };

          const categories = [];
          result.recordset.forEach((record) => {
            const categoryObj = {
              id: record.CategoryId,
              name: record.CategoryName,
              estimation: record.CategoryEstimation,
            };

            categories.push(new Category(categoryObj));
          });

          resolve(categories);
        } catch (err) {
          console.log(err);
          reject(err);
        }
        // sql.close();
      })();
    });
  }

  static readById(containerId, categoryId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const pool = await sql.connect(connection);
          const result = await pool
            .request()
            .input("ContainerId", sql.Int, containerId)
            .input("CategoryId", sql.Int, categoryId).query(`
                            SELECT bpCategory.CategoryId, bpCategory.CategoryName, bpContainerCategory.CategoryEstimation FROM bpCategory
                            INNER JOIN bpContainerCategory
                            ON bpContainerCategory.CategoryId = bpCategory.CategoryId
                            WHERE bpContainerCategory.ContainerId = @ContainerId AND bpCategory.CategoryId = @CategoryId;
                    `);

          if (!result.recordset[0]) {
            throw {
              status: 500,
              message: "Failed to get category",
            };
          }

          const record = result.recordset[0];
          const category = new Category({
            id: record.CategoryId,
            name: record.CategoryName,
            estimation: record.CategoryEstimation,
          });

          resolve(category);
        } catch (err) {
          console.log(err);
          reject(err);
        }

        // sql.close();
      })();
    });
  }

  update(categoryObj) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const pool = await sql.connect(connection);
          if (categoryObj.name !== this.name) {
            const result = await pool
              .request()
              .input("CategoryName", sql.NVarChar, categoryObj.name)
              .input("CategoryId", sql.Int, this.id).query(`
                            UPDATE bpCategory SET CategoryName = @CategoryName
                            WHERE CategoryId = @CategoryId
                        `);

            if (!result.rowsAffected[0]) {
              throw { status: 500, message: "Failed to update category" };
            }

            if (result.rowsAffected.length != 1) {
              throw { status: 500, message: "Database is corrupt" };
            }

            this.name = categoryObj.name;
          }

          if (
            categoryObj.estimation &&
            categoryObj.estimation !== this.estimation
          ) {
            const result = await pool
              .request()
              .input("CategoryEstimation", sql.Int, categoryObj.estimation)
              .input("CategoryId", sql.Int, this.id).query(`
                            UPDATE bpContainerCategory SET CategoryEstimation = @CategoryEstimation
                            WHERE CategoryId = @CategoryId
                        `);

            if (!result.rowsAffected[0]) {
              throw { status: 500, message: "Failed to update category" };
            }

            if (result.rowsAffected.length != 1) {
              throw { status: 500, message: "Database is corrupt" };
            }

            this.estimation = categoryObj.estimation;
          }

          resolve();
        } catch (err) {
          console.log(err);
          reject(err);
        }
        // sql.close();
      })();
    });
  }

  static delete(containerId, categoryId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const pool = await sql.connect(connection);
          const result = await pool
            .request()
            .input("CategoryId", sql.Int, categoryId)
            .input("ContainerId", sql.Int, containerId).query(`
                        UPDATE bpContainerTransaction SET CategoryId = NULL
                        WHERE ContainerId = @ContainerId AND CategoryId = @CategoryId;

                        DELETE FROM bpContainerCategory
                        WHERE ContainerId = @ContainerId AND CategoryId = @CategoryId;

                        DELETE FROM bpCategory WHERE CategoryId = @CategoryId
                `);

          resolve();
        } catch (err) {
          console.log(err);
          reject(err);
        }
        // sql.close();
      })();
    });
  }
}

module.exports = Category;
