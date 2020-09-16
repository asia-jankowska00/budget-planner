const connection = require("../config/connection");
const sql = require("mssql");

class Container {
  constructor(container) {
    this.id = container.id;
    this.name = container.name;
    this.owner = container.owner;
    this.sources = container.sources;
    this.collaborators = container.collaborators;
    this.categories = container.categories;
    this.latestTrasactions = container.latestTrasactions;
  }

  static create(containerObj, userObj) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const input = containerObj;
          const user = userObj;

          const pool = await sql.connect(connection);
          const result = await pool
            .request()
            .input("ContainerName", sql.NVarChar, input.name)
            .input("UserId", sql.NVarChar, user.id).query(`
                INSERT INTO bpContainer (ContainerName, UserId)
                VALUES (@ContainerName, @UserId);

                SELECT ContainerId
                FROM bpContainer
                WHERE ContainerId = SCOPE_IDENTITY();
            `);

          if (!result.recordset[0])
            throw {
              status: 500,
              message: "Failed to save Container to database.",
            };

          const containerId = result.recordset[0].ContainerId;

          let sourceQuery =
            "INSERT INTO bpContainerSource (ContainerId, SourceId) VALUES ";

          input.sources.forEach((sourceId) => {
            sourceQuery += `(${containerId}, ${sourceId}), `;
          });

          sourceQuery = sourceQuery.slice(0, -2);
          sourceQuery += ";";

          await pool.request().query(sourceQuery);

          const finalResult = await pool
            .request()
            .input("ContainerId", sql.NVarChar, containerId)
            .input("UserId", sql.NVarChar, user.id).query(`
                SELECT *
                FROM bpContainer
                WHERE ContainerId = @ContainerId;

                SELECT SourceId
                FROM bpContainerSource
                WHERE ContainerId = @ContainerId;
            `);

          const newContainer = new Container({
            id: finalResult.recordsets[0][0].ContainerId,
            name: finalResult.recordsets[0][0].ContainerName,
            ownerId: finalResult.recordsets[0][0].UserId,
            sources: finalResult.recordsets[1].map((recordset) => {
              return recordset.SourceId;
            }),
          });
          console.log(newContainer);

          resolve(newContainer);
        } catch (err) {
          console.log(err);
          reject(err);
        }
        sql.close();
      })();
    });
  }

  static readById(containerId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const pool = await sql.connect(connection);
          const result = await pool
            .request()
            .input("ContainerId", sql.Int, containerId).query(`
            SELECT ContainerId, ContainerName FROM bpContainer
            WHERE ContainerId = @ContainerId;
            `);

          console.log(result);
          if (!result.recordset[0]) {
            throw {
              status: 500,
              message: "Failed to get container",
            };
          }
          const record = result.recordset[0];

          const container = new Container({
            id: record.ContainerId,
            name: record.ContainerName,
          });

          resolve(container);
        } catch (err) {
          console.log(err);
          reject(err);
        }

        sql.close();
      })();
    });
  }

  static readAll(userObj) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const pool = await sql.connect(connection);
          const result = await pool
            .request()
            .input("UserId", sql.Int, userObj.id).query(`
          SELECT * FROM bpContainer WHERE UserId = @UserId;
          `);

          if (result.recordset.length <= 0)
            throw {
              status: 404,
              message: "No containers found",
            };

          const containers = [];
          result.recordset.forEach((record) => {
            const containerObj = {
              id: record.ContainerId,
              name: record.ContainerName,
            };

            containers.push(new Container(containerObj));
          });
          resolve(containers);
        } catch (err) {
          console.log(err);
          reject(err);
        }
        sql.close();
      })();
    });
  }

  update(containerObj, userObj) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const input = containerObj;

          const key = Object.keys(input)[0];

          this[key] = input[key];

          const pool = await sql.connect(connection);
          const result = await pool
            .request()
            .input("ContainerId", sql.Int, this.id)
            .input("ContainerName", sql.NVarChar, this.name)
            .input("UserId", sql.Int, userObj.id).query(`
                  UPDATE bpContainer
                  SET ContainerName = @ContainerName
                  WHERE ContainerId = @ContainerId AND UserId = @UserId;
              `);

          // below might happen if user is unauthorized, should we take that into account?
          if (!result.rowsAffected[0]) {
            throw {
              status: 500,
              message: "Failed to update container",
            };
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
      })();
    });
  }

  static delete(containerId, userObj) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const pool = await sql.connect(connection);

          const resultOwner = await pool
            .request()
            .input("ContainerId", sql.Int, containerId)
            .input("UserId", sql.Int, userObj.id).query(`
          SELECT UserId FROM bpContainer
          WHERE ContainerId = @ContainerId AND UserId = @UserId;
          `);

          if (!resultOwner.recordset[0]) {
            throw {
              status: 401,
              message: "You are not authorized to delete this source",
            };
          }

          const result = await pool
            .request()
            .input("ContainerId", sql.Int, containerId).query(`
            DELETE FROM bpContainerSource
            WHERE ContainerId = @ContainerId;
            
            DELETE FROM bpUserContainer
            WHERE ContainerId = @ContainerId;
  
            DELETE FROM bpContainerCategory 
            WHERE ContainerId = @ContainerId;

            DELETE FROM bpContainer
            WHERE ContainerId = @ContainerId;
              `);

          resolve();
        } catch (err) {
          console.log(err);
          reject(err);
        }
        sql.close();
      })();
    });
  }
}

module.exports = Container;
