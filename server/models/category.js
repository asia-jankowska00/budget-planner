const pool = require("../db");

class Category {
  constructor(category) {
    this.id = category.id;
    this.name = category.name;
    this.containerId = category.containerId;
    this.estimation = category.estimation ? category.estimation : 0;
  }

  static create(containerId, categoryObj) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const { rows: newCategoryId } = await pool.query(`
            INSERT INTO bpCategory (CategoryName, ContainerId, CategoryEstimation)
            VALUES ($1, $2, $3) RETURNING CategoryId;`, [categoryObj.name, containerId, categoryObj.estimation])

          const categoryId = newCategoryId[0].categoryid;

          const { rows } = await pool.query(`
            SELECT CategoryId, CategoryName, ContainerId, CategoryEstimation
            FROM bpCategory
            WHERE bpCategory.CategoryId = $1;
          `, [categoryId]);

          if (!rows[0])
            throw {
              status: 500,
              message: "Failed to save Category to database",
            };

          const record = rows[0];

          const newCategory = new Category({
            id: record.categoryid,
            name: record.categoryname,
            containerId: record.containerid,
            estimation: record.categoryestimation,
          });

          resolve(newCategory);
        } catch (err) {
          console.log(err);
          reject(err);
        }
      })();
    });
  }

  static readAll(containerId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const { rows } = await pool.query(`
            SELECT CategoryId, CategoryName, ContainerId, CategoryEstimation 
            FROM bpCategory
            WHERE ContainerId = $1;
          `, [containerId]);

          if (rows.length <= 0)
            throw {
              status: 404,
              message: "No categories found",
            };

          const categories = [];
          rows.forEach((record) => {
            const categoryObj = {
              id: record.categoryid,
              name: record.categoryname,
              containerId: record.containerid,
              estimation: record.categoryestimation,
            };

            categories.push(new Category(categoryObj));
          });

          resolve(categories);
        } catch (err) {
          console.log(err);
          reject(err);
        }
      })();
    });
  }

  static readById(containerId, categoryId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const { rows } = await pool.query(`
            SELECT CategoryId, CategoryName, ContainerId, CategoryEstimation 
            FROM bpCategory
            WHERE ContainerId = $1 AND CategoryId = $2;
          `, [containerId, categoryId]);

          if (!rows[0]) {
            throw {
              status: 500,
              message: "Failed to get category",
            };
          }

          const record = rows[0];
          const category = new Category({
            id: record.categoryid,
            name: record.categoryname,
            containerId: record.containerid,
            estimation: record.categoryestimation,
          });

          resolve(category);
        } catch (err) {
          console.log(err);
          reject(err);
        }
      })();
    });
  }

  update(categoryObj) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          if (categoryObj.name !== this.name) {
            const { rows } = await pool.query(`
              UPDATE bpCategory SET CategoryName = $1
              WHERE CategoryId = $2 RETURNING CategoryId;
            `, [categoryObj.name, this.id]);

            if (!rows[0]) {
              throw { status: 500, message: "Failed to update category" };
            }

            if (rows.length != 1) {
              throw { status: 500, message: "Database is corrupt" };
            }

            this.name = categoryObj.name;
          }

          if (
            categoryObj.estimation &&
            categoryObj.estimation !== this.estimation
          ) {
            const { rows } = await pool.query(`
              UPDATE bpCategory SET CategoryEstimation = $1
              WHERE CategoryId = $2 RETURNING CategoryId;
            `, [categoryObj.estimation, this.id]);

            if (!rows[0]) {
              throw { status: 500, message: "Failed to update category" };
            }

            if (rows.length != 1) {
              throw { status: 500, message: "Database is corrupt" };
            }

            this.estimation = categoryObj.estimation;
          }

          resolve();
        } catch (err) {
          console.log(err);
          reject(err);
        }
      })();
    });
  }

  static delete(containerId, categoryId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          await pool.query(`
            UPDATE bpContainerTransaction SET CategoryId = null
            WHERE ContainerId = $1 AND CategoryId = $2;
          `, [containerId, categoryId])

          await pool.query(`
            DELETE FROM bpCategory WHERE CategoryId = $1;
          `, [categoryId]);

          resolve();
        } catch (err) {
          console.log(err);
          reject(err);
        }
      })();
    });
  }

  static checkContainerCategory(containerId, categoryId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const { rows } = await pool.query(`
            SELECT * FROM bpCategory
            WHERE ContainerId = $1 AND CategoryId = $2;
          `, [containerId, categoryId]);

          if (rows.length < 1) {
            throw {
              status: 400,
              message: "Category not part of the container",
            };
          }

          if (rows.length > 1) {
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
      })();
    });
  }
}

module.exports = Category;
