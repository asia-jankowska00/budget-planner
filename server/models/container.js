const connection = require("../config/connection");
const sql = require("mssql");
const Source = require("./source");
const User = require("./user");

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

          resolve();
        } catch (err) {
          console.log(err);
          reject(err);
        }
        sql.close();
      })();
    });
  }

  static create(containerObj, userObj) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const input = containerObj;
          const user = userObj;

          // get fullSource objects
          // this will fail if the user doesn't have access to the requested sources
          const sources = await Promise.all(
            input.sources.map((source) => Source.readById(source, user))
          )

          // create the container
          const insertPool = await sql.connect(connection);
          const containerQuery = await insertPool
            .request()
            .input("ContainerName", sql.NVarChar, input.name)
            .input("UserId", sql.NVarChar, user.id).query(`
                INSERT INTO bpContainer (ContainerName, UserId)
                VALUES (@ContainerName, @UserId);

                SELECT *
                FROM bpContainer
                WHERE ContainerId = SCOPE_IDENTITY()
            `);

          if (!containerQuery.recordset[0])
            throw {
              status: 500,
              message: "Failed to save Container to database.",
            };

          const containerRecord = containerQuery.recordset[0];
          const containerId = containerRecord.ContainerId;

          sql.close(); // close connection to allow other methods

          // bind the sources to the container
          await Promise.all(
            input.sources.map((sourceId) => Container.insertContainerSource(containerId, sourceId))
          )

          // get owner full object
          const owner = await User.readById(user.id)

          // BIND OWNER TO CONTAINER
          // MISSING - needs to be implemented

          const newContainer = new Container({
            id: containerRecord.ContainerId,
            name: containerRecord.ContainerName,
            owner,
            sources
          });

          resolve(newContainer);
        } catch (err) {
          console.log(err);
          reject(err);
          sql.close();
        }
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
          SELECT * FROM bpContainer
          INNER JOIN
          bpUserContainer
          ON bpContainer.ContainerId = bpUserContainer.ContainerId
          WHERE UserId = @UserId;
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
