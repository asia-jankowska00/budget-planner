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
              message: "This user is not the owner of this container",
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
              message: "This user does not have access to this container",
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

  static checkSourceContainer(sourceId, containerId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const pool = await sql.connect(connection);

          const result = await pool
            .request()
            .input("ContainerId", sql.Int, containerId)
            .input("SourceId", sql.Int, sourceId).query(`
          SELECT SourceContainerId FROM bpSourceContainer
          WHERE ContainerId = @ContainerId AND SourceId = @SourceId;
          `);

          if (!result.recordset[0]) {
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
                "This user does not have access to this source in this container",
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

          const result1 = await pool
            .request()
            .input("ContainerId", sql.Int, this.id)
            .input("UserId", sql.Int, user.id)
            .query(
              `
              SELECT UserId FROM bpUserContainer 
              WHERE UserId = @UserId AND ContainerId = @ContainerId;
              `
            );

          if (result1.recordset[0])
            throw {
              status: 400,
              message: "Collaborator already exists in this container.",
            };

          const result2 = await pool
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

          if (!result2.recordset[0])
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

          const collaborators = result.recordsets[0].map((record) => {
            return record.UserId;
          });

          resolve(collaborators);
        } catch (err) {
          console.log(err);
          reject(err);
        }

        sql.close();
      })();
    });
  }

  deleteCollaborator(userId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const pool = await sql.connect(connection);

          await pool
            .request()
            .input("ContainerId", sql.Int, this.id)
            .input("UserId", sql.Int, userId)
            .query(
              `
              DELETE bpUserSourceContainer FROM bpUserSourceContainer
              INNER JOIN bpUserContainer
              ON bpUserSourceContainer.UserContainerId = bpSourceContainer.UserContainerId
              WHERE UserId = @UserId;

              DELETE FROM bpUserContainer 
              WHERE UserId = @UserId AND ContainerId = @ContainerId;
              `
            );

          resolve();
        } catch (err) {
          console.log(err);
          reject(err);
        }
        sql.close();
      })();
    });
  }

  //source methods
  addSource(sourceId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const pool = await sql.connect(connection);

          // check if the container already has the source attached!
          const result1 = await pool
            .request()
            .input("ContainerId", sql.Int, this.id)
            .input("SourceId", sql.Int, sourceId)
            .query(
              `
              SELECT SourceId FROM bpSourceContainer 
              WHERE SourceId = @SourceId AND ContainerId = @ContainerId;
              `
            );

          if (result1.recordset[0])
            throw {
              status: 400,
              message: "Source already exists in this container.",
            };

          const result2 = await pool
            .request()
            .input("ContainerId", sql.Int, this.id)
            .input("SourceId", sql.Int, sourceId)
            .query(
              `
              INSERT INTO bpSourceContainer (SourceId, ContainerId)
              VALUES (@SourceId, @ContainerId);

              SELECT SourceId FROM bpSourceContainer 
              WHERE SourceId = @SourceId AND ContainerId = @ContainerId;
              `
            );

          if (!result2.recordset[0])
            throw {
              status: 500,
              message: "Failed to add source to container.",
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

  getSources() {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const pool = await sql.connect(connection);

          const result = await pool
            .request()
            .input("ContainerId", sql.Int, this.id).query(`
            SELECT SourceId FROM bpSourceContainer
            WHERE ContainerId = @ContainerId;
              `);

          if (!result.recordset[0])
            throw {
              status: 404,
              message: "No sources found.",
            };

          const sources = result.recordsets[0].map((record) => {
            return record.SourceId;
          });

          resolve(sources);
        } catch (err) {
          console.log(err);
          reject(err);
        }

        sql.close();
      })();
    });
  }

  deleteSource(sourceId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const pool = await sql.connect(connection);

          await pool
            .request()
            .input("ContainerId", sql.Int, this.id)
            .input("SourceId", sql.Int, sourceId)
            .query(
              `
              DELETE bpUserSourceContainer FROM bpUserSourceContainer
              INNER JOIN bpSourceContainer
              ON bpUserSourceContainer.SourceContainerId = bpSourceContainer.SourceContainerId
              WHERE SourceId = @SourceId;

              DELETE FROM bpSourceContainer 
              WHERE SourceId = @SourceId AND ContainerId = @ContainerId;
              `
            );

          resolve();
        } catch (err) {
          console.log(err);
          reject(err);
        }
        sql.close();
      })();
    });
  }

  addPermission(UserContainerId, SourceContainerId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const pool = await sql.connect(connection);

          const result2 = await pool
            .request()
            .input("UserContainerId", sql.Int, UserContainerId)
            .input("SourceContainerId", sql.Int, SourceContainerId)
            .query(
              `
              INSERT INTO bpUserSourceContainer (UserContainerId, SourceContainerId)
              VALUES (@UserContainerId, @SourceContainerId);

              SELECT * FROM bpUserSourceContainer 
              WHERE UserContainerId = @UserContainerId AND SourceContainerId = @SourceContainerId;
              `
            );

          if (!result2.recordset[0])
            throw {
              status: 500,
              message: "Failed to add permission to source.",
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

  getPermissions(sourceId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const pool = await sql.connect(connection);

          const result = await pool
            .request()
            .input("SourceId", sql.Int, sourceId)
            .input("ContainerId", sql.Int, this.id).query(`
            SELECT SourceContainerId FROM bpSourceContainer
            WHERE ContainerId = @ContainerId AND SourceId = @SourceId;
              `);

          if (!result.recordset[0])
            throw {
              status: 404,
              message: "This source doesn't exist in this container.",
            };

          const SourceContainerId = result.recordset[0].SourceContainerId;

          const result2 = await pool
            .request()
            .input("SourceContainerId", sql.Int, SourceContainerId).query(`
          SELECT UserId FROM bpUserSourceContainer
          INNER JOIN
          bpUserContainer
          ON bpUserSourceContainer.UserContainerId = bpUserContainer.UserContainerId
          WHERE SourceContainerId = @SourceContainerId;
            `);

          if (!result2.recordset[0])
            throw {
              status: 404,
              message: "This source has no bound permissions.",
            };

          const users = result2.recordsets[0].map((record) => {
            return record.UserId;
          });

          // const UserContainerId = result2.recordset[0].UserContainerId;

          //   const result3 = await pool
          //   .request()
          //   .input("UserContainerId", sql.Int, SourceContainerId).query(`
          // SELECT UserId FROM bpUserContainer
          // WHERE UserContainerId = @UserContainerId;
          //   `);

          // if (!result.recordset[0])
          // throw {
          //   status: 404,
          //   message: "User not found",
          // };

          // const UserId = result3.recordset[0].UserId;

          resolve(users);
        } catch (err) {
          console.log(err);
          reject(err);
        }

        sql.close();
      })();
    });
  }

  deletePermissions(sourceId, userId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const pool = await sql.connect(connection);

          await pool
            .request()
            .input("UserId", sql.Int, userId)
            .input("SourceId", sql.Int, sourceId)
            .query(
              `
              DELETE bpUserSourceContainer FROM bpUserSourceContainer
              INNER JOIN bpSourceContainer
              ON bpUserSourceContainer.SourceContainerId = bpSourceContainer.SourceContainerId
              INNER JOIN bpUserContainer
              ON bpUserSourceContainer.UserContainerId = bpUserContainer.UserContainerId
              WHERE SourceId = @SourceId and UserId = @UserId;
              `
            );
          resolve();
        } catch (err) {
          console.log(err);
          reject(err);
        }
        sql.close();
      })();
    });
  }

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

          if (result.recordset.length < 0)
            throw {
              status: 404,
              message: "No containers found",
            };

          const containers = [];
          
          if (result.recordset.length > 0) {
            result.recordset.forEach((record) => {
              const containerObj = {
                id: record.ContainerId,
                name: record.ContainerName,
                owner: { id: record.UserId },
              };
  
              containers.push(new Container(containerObj));
            });
          }
          
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
