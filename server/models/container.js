const connection = require("../config/connection");
const sql = require("mssql");

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

  // checker methods
  static checkOwner(containerId, userId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const pool = await sql.connect(connection);
          const access = await pool
            .request()
            .input("ContainerId", sql.Int, containerId)
            .input("UserId", sql.Int, userId).query(`
          SELECT ContainerId FROM bpContainer
          WHERE ContainerId = @ContainerId AND UserId = @UserId;
          `);

          if (!access.recordset[0]) {
            throw {
              status: 401,
              message: "You are not the owner of this container",
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

  static checkUserContainer(userId, containerId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const pool = await sql.connect(connection);

          // check if user has access to the container
          const access = await pool
            .request()
            .input("ContainerId", sql.Int, containerId)
            .input("UserId", sql.Int, userId).query(`
          SELECT UserContainerId FROM bpUserContainer
          WHERE ContainerId = @ContainerId AND UserId = @UserId;
          `);

          if (!access.recordset[0]) {
            throw {
              status: 401,
              message: "You are not authorized to access this container",
            };
          }

          const UserContainerId = access.recordset[0].UserContainerId;

          resolve(UserContainerId);
        } catch (err) {
          console.log(err);
          reject(err);
        }

        sql.close();
      })();
    });
  }

  static checkSourceContainer(source, container) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const pool = await sql.connect(connection);

          // check if user has access to the container
          const access = await pool
            .request()
            .input("ContainerId", sql.Int, container.id)
            .input("SourceId", sql.Int, source.id).query(`
          SELECT SourceContainerId FROM bpUserContainer
          WHERE ContainerId = @ContainerId AND SourceId = @SourceId;
          `);

          if (!access.recordset[0]) {
            throw {
              status: 401,
              message: "This source is not bound to this container",
            };
          }

          const SourceContainerId = result.recordset[0].SourceContainerId;

          resolve(SourceContainerId);
        } catch (err) {
          console.log(err);
          reject(err);
        }

        sql.close();
      })();
    });
  }

  static checkUserSourceContainer(userContainerId, sourceContainerId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const pool = await sql.connect(connection);

          // check if user has access to the container
          const access = await pool
            .request()
            .input("UserContainerId", sql.Int, userContainerId)
            .input("SourceContainerId", sql.Int, sourceContainerId).query(`
          SELECT * FROM bpUserSourceContainer
          WHERE UserContainerId = @UserContainerId AND SourceContainerId = @SourceContainerId;
          `);

          if (!access.recordset[0]) {
            throw {
              status: 401,
              message:
                "This you do not have access to this source in this container",
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

  // insert utility for loops
  static insertSourceContainer(sourceId, containerId, requesterId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const pool = await sql.connect(connection);

          const insert = await pool
            .request()
            .input("UserId", sql.NVarChar, requesterId)
            .input("ContainerId", sql.NVarChar, containerId)
            .input("SourceId", sql.NVarChar, sourceId).query(`
              INSERT INTO bpSourceContainer (SourceId, ContainerId) 
              VALUES (@SourceId, @ContainerId);

              SELECT SourceContainerId
              FROM bpSourceContainer
              WHERE SourceId = @SourceId AND ContainerId = @ContainerId;

              SELECT UserContainerId
              FROM bpUserContainer
              WHERE ContainerId = @ContainerId AND UserId = @UserId;
            `);

          if (!insert.recordset[0])
            throw {
              status: 500,
              message: "Failed to save source to database.",
            };

          const SourceContainerId = insert.recordsets[0][0].SourceContainerId;
          const UserContainerId = insert.recordsets[1][0].UserContainerId;

          const permissionInsert = await pool
            .request()
            .input("UserContainerId", sql.NVarChar, UserContainerId)
            .input("SourceContainerId", sql.NVarChar, SourceContainerId).query(`
            INSERT INTO bpUserSourceContainer (UserContainerId, SourceContainerId) 
            VALUES (@UserContainerId, @SourceContainerId);

            SELECT * FROM bpUserSourceContainer 
            WHERE UserContainerId = @UserContainerId
            AND SourceContainerId = @SourceContainerId;
          `);

          if (!permissionInsert.recordset[0])
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

  // collaborator methods
  addCollaborator(user) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const pool = await sql.connect(connection);

          const result = await pool
            .request()
            .input("ContainerId", sql.Int, this.id)
            .input("UserId", sql.Int, user.id)
            .query(
              `
              INSERT INTO bpUserContainer (UserId, ContainerId)
              VALUES (@UserId, @ContainerId);

              SELECT UserId FROM bpUserContainer WHERE UserContainerId = SCOPE_IDENTITY();
              `
            );

          if (!result.recordset[0])
            throw {
              status: 500,
              message: "Failed to add collaborator.",
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

  getCollaborators() {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const pool = await sql.connect(connection);

          const result = await pool
            .request()
            .input("ContainerId", sql.Int, this.id).query(`
            SELECT UserId FROM bpUserContainer
            WHERE ContainerId = @ContainerId;
              `);

          if (!result.recordset[0])
            throw {
              status: 404,
              message: "No collaborators found.",
            };

          const collaborators = result.recordset[0];
          console.log(collaborators);

          resolve();
        } catch (err) {
          console.log(err);
          reject(err);
        }

        sql.close();
      })();
    });
  }

  deleteCollaborator() {}

  //source methods
  getSources() {}

  addSource(sourceId, userObj) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          // const sourceToAdd = await Source.readById(sourceId, userObj);

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

  deleteSource() {}

  // container CRUD
  static create(containerObj, userObj) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const input = containerObj;
          const user = userObj;

          // create the container
          const insertPool = await sql.connect(connection);
          const containerQuery = await insertPool
            .request()
            .input("ContainerName", sql.NVarChar, input.name)
            .input("UserId", sql.Int, user.id).query(`
                INSERT INTO bpContainer (ContainerName, UserId)
                VALUES (@ContainerName, @UserId);

                INSERT INTO bpUserContainer (UserId, ContainerId)
                VALUES (@UserId, IDENT_CURRENT('bpContainer'));
                
                SELECT *
                FROM bpContainer
                WHERE ContainerId = IDENT_CURRENT('bpContainer');
            `);

          if (!containerQuery.recordset[0])
            throw {
              status: 500,
              message: "Failed to save Container to database.",
            };

          const containerRecord = containerQuery.recordset[0];

          const newContainer = new Container({
            id: containerRecord.ContainerId,
            name: containerRecord.ContainerName,
          });

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
            SELECT 
            ContainerId, ContainerName, UserId
            FROM bpContainer
            WHERE ContainerId = @ContainerId;

            SELECT SourceId
            FROM bpSourceContainer
            WHERE ContainerId = @ContainerId;
            `);

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
            owner: { id: record.UserId },
            sources: result.recordsets[1].map((source) => {
              return source.SourceId;
            }),
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

          // get all containers where user has access
          const result = await pool
            .request()
            .input("UserId", sql.Int, userObj.id).query(`
            SELECT DISTINCT 
            bpContainer.ContainerId, bpContainer.ContainerName, bpContainer.UserId 
            FROM bpContainer
            INNER JOIN
            bpUserContainer
            ON bpContainer.ContainerId = bpUserContainer.ContainerId
            WHERE bpUserContainer.UserId = @UserId;
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
              owner: { id: record.UserId },
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
          const pool = await sql.connect(connection);

          // check if user is the owner of the container
          const resultOwner = await pool
            .request()
            .input("ContainerId", sql.Int, this.id)
            .input("UserId", sql.Int, userObj.id).query(`
            SELECT UserId FROM bpContainer
            WHERE ContainerId = @ContainerId AND UserId = @UserId;
          `);

          if (!resultOwner.recordset[0]) {
            throw {
              status: 401,
              message: "You are not authorized to update this container",
            };
          }

          const input = containerObj;

          const key = Object.keys(input)[0];

          this[key] = input[key];

          const result = await pool
            .request()
            .input("ContainerId", sql.Int, this.id)
            .input("ContainerName", sql.NVarChar, this.name)
            .input("UserId", sql.Int, userObj.id).query(`
                  UPDATE bpContainer
                  SET ContainerName = @ContainerName
                  WHERE ContainerId = @ContainerId AND UserId = @UserId;
              `);

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

  static delete(containerId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const pool = await sql.connect(connection);

          await pool.request().input("ContainerId", sql.Int, containerId)
            .query(`
            DELETE bpUserSourceContainer FROM bpUserSourceContainer
            INNER JOIN bpUserContainer
            ON bpUserSourceContainer.UserContainerId = bpUserContainer.UserContainerId
            WHERE ContainerId = @ContainerId;

            DELETE FROM bpUserContainer
            WHERE ContainerId = @ContainerId;

            DELETE FROM bpSourceContainer
            WHERE ContainerId = @ContainerId;
  
            DELETE FROM bpContainerCategory 
            WHERE ContainerId = @ContainerId;
               
            DELETE FROM bpContainerTransaction 
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
