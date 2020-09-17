const connection = require("../config/connection");
const sql = require("mssql");
const Source = require("./source");

class Container {
  constructor(container) {
    this.id = container.id;
    this.name = container.name;
    this.owner = container.owner;
    if (container.owner) {
      this.owner = {};
      this.owner.id = container.owner.id;
      this.owner.firstName = container.owner.firstName;
      this.owner.lastName = container.owner.lastName;
      this.owner.username = container.owner.username;
    }

    this.sources = container.sources;
    if (container.collaborators) {
      this.collaborators = container.collaborators;
    }
    if (container.categories) {
      this.categories = container.categories;
    }
    if (container.latestTrasactions) {
      this.latestTrasactions = container.latestTrasactions;
    }
  }

  static insertContainerSource(containerId, sourceId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const pool = await sql.connect(connection);
          const result = await pool
            .request()
            .input("ContainerId", sql.NVarChar, containerId)
            .input("SourceId", sql.NVarChar, sourceId).query(`
              INSERT INTO bpContainerSource (ContainerId, SourceId) 
              VALUES (@ContainerId, @SourceId);

              SELECT SourceId
              FROM bpContainerSource
              WHERE SourceId = @SourceId AND ContainerId = @ContainerId;
            `);

          if (!result.recordset[0])
            throw {
              status: 500,
              message: "Failed to save source to database.",
            };

          const source = result.recordset[0].SourceId;

          resolve(source);
        } catch (err) {
          console.log(err);
          reject(err);
        }
        sql.close();
      })();
    });
  }

  readAllSources() {}

  addSource(sourceId, userObj) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const sourceToAdd = Source.readById(sourceId, userObj);

          // check if the container already has the source attached!

          const pool = await sql.connect(connection);
          pool
            .request()
            .input("ContainerId", sql.Int, this.id)
            .input("SourceId", sql.Int, sourceId)
            .query(
              `
              INSERT INTO bpContainerSource (ContainerId, SourceId)
              VALUES (@ContainerId, @SourceId);
              `
            );

          const containerWithNewSource = this;
          console.log(this);
          // containerWithNewSource.push(sourceId);

          resolve(new Container(containerWithNewSource));
        } catch (err) {
          console.log(err);
          reject(err);
        }

        sql.close();
      })();
    });
  }

  removeSource() {}

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
            .input("UserId", sql.Int, user.id).query(`
                INSERT INTO bpContainer (ContainerName, UserId)
                VALUES (@ContainerName, @UserId);

                INSERT INTO bpUserContainer (UserId, ContainerId)
                VALUES (@UserId, IDENT_CURRENT('bpContainer'));

                SELECT ContainerId
                FROM bpContainer
                WHERE ContainerId = IDENT_CURRENT('bpContainer');
            `);

          if (!result.recordset[0])
            throw {
              status: 500,
              message: "Failed to save Container to database.",
            };

          const containerId = result.recordset[0].ContainerId;

          sql.close();

          input.sources.forEach(async (sourceId) => {
            try {
              await Container.insertContainerSource(containerId, sourceId);
            } catch (err) {
              console.log(err);
              reject(err);
            }
          });
          console.log("after foreach");

          const pool2 = await sql.connect(connection);
          const finalResult = await pool2
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

          sql.close();

          const newContainer = new Container({
            id: finalResult.recordsets[0][0].ContainerId,
            name: finalResult.recordsets[0][0].ContainerName,
            owner: {
              id: finalResult.recordsets[0][0].UserId,
            },

            sources: finalResult.recordsets[1].map((recordset) => {
              return recordset.SourceId;
            }),
          });

          const sourcesPromises = newContainer.sources.map((sourceId) => {
            return Source.readById(sourceId, user);
          });

          Promise.all(sourcesPromises).then((values) => {
            newContainer.sources = values;
            console.log(newContainer);
            resolve(newContainer);
          });
        } catch (err) {
          console.log(err);
          reject(err);
        }
        sql.close();
      })();
    });
  }

  static readById(containerId, userObj) {
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
              message: "You are not authorized to access this container",
            };
          }

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
          SELECT bpContainer.ContainerId, bpContainer.ContainerName 
          FROM bpContainer
          INNER JOIN
          bpUserContainer
          ON bpContainer.ContainerId = bpUserContainer.ContainerId
          WHERE bpContainer.UserId = @UserId;
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
              message: "You are not authorized to delete this container",
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
