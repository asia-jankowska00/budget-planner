const pool = require("../db");

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
          const { rows: access } = await pool.query(`
            SELECT ContainerId FROM bpContainer
            WHERE ContainerId = $1 AND UserId = $2;
          `, [containerId, userId]);

          if (!access[0]) {
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
      })();
    });
  }

  static checkUserContainer(userId, containerId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const { rows } = await pool.query(`
            SELECT UserContainerId FROM bpUserContainer
            WHERE ContainerId = $1 AND UserId = $2;
          `, [containerId, userId]);

          if (!rows[0]) {
            throw {
              status: 401,
              message: "This user does not have access to this container",
            };
          }

          const UserContainerId = rows[0].usercontainerid;

          resolve(UserContainerId);
        } catch (err) {
          console.log(err);
          reject(err);
        }
      })();
    });
  }

  static checkSourceContainer(sourceId, containerId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const { rows } = await pool.query(`
          SELECT SourceContainerId FROM bpSourceContainer
          WHERE ContainerId = $1 AND SourceId = $2;
          `, [containerId, sourceId]);

          if (!rows[0]) {
            throw {
              status: 401,
              message: "This source is not bound to this container",
            };
          }

          const SourceContainerId = rows[0].sourcecontainerid;

          resolve(SourceContainerId);
        } catch (err) {
          console.log(err);
          reject(err);
        }
      })();
    });
  }

  
  static checkUserSourceContainer(userContainerId, sourceContainerId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const { rows } = await pool.query(`
            SELECT * FROM bpUserSourceContainer
            WHERE UserContainerId = $1 AND SourceContainerId = $2;
          `, [userContainerId, sourceContainerId]);

          if (!rows[0]) {
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
      })();
    });
  }

  // insert utility for loops
  static insertSourceContainer(sourceId, containerId, requesterId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          await pool.query(`
            INSERT INTO bpSourceContainer (SourceId, ContainerId) 
            VALUES ($2, $1) RETURNING SourceContainerId;
          `, [containerId, sourceId])

          const { rows: sourcecontainerid } = await pool.query(`
            SELECT SourceContainerId
            FROM bpSourceContainer
            WHERE SourceId = $2 AND ContainerId = $1;
          `, [containerId, sourceId]);

          const { rows: usercontainerid } = await pool.query(`
            SELECT UserContainerId
            FROM bpUserContainer
            WHERE ContainerId = $1 AND UserId = $2;
          `, [containerId, requesterId]);

          if (!sourcecontainerid[0] || !usercontainerid[0])
            throw {
              status: 500,
              message: "Failed to save source to database.",
            };

          const SourceContainerId = sourcecontainerid[0].sourcecontainerid;
          const UserContainerId = usercontainerid[0].usercontainerid;

          const { rows: permissionInsert } = await pool.query(`
            INSERT INTO bpUserSourceContainer (UserContainerId, SourceContainerId) 
            VALUES ($1, $2) RETURNING UserSourceContainerId;
          `, [UserContainerId, SourceContainerId]);

          if (!permissionInsert[0])
            throw {
              status: 500,
              message: "Failed to save source to database.",
            };

          resolve();
        } catch (err) {
          console.log(err);
          reject(err);
        }
      })();
    });
  }

  // collaborator methods
  addCollaborator(user) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const { rows: exists } = await pool.query(`
            SELECT UserId FROM bpUserContainer 
            WHERE UserId = $2 AND ContainerId = $1;
          `, [this.id, user.id]);

          if (exists[0])
            throw {
              status: 400,
              message: "Collaborator already exists in this container.",
            };

          const { rows: collaborator } = await pool.query(`
              INSERT INTO bpUserContainer (UserId, ContainerId)
              VALUES ($2, $1) RETURNING UserContainerId RETURNING UserContainerId;
            `, [this.id, user.id]);

          if (!collaborator[0])
            throw {
              status: 500,
              message: "Failed to add collaborator.",
            };

          resolve();
        } catch (err) {
          console.log(err);
          reject(err);
        }
      })();
    });
  }

  getCollaborators() {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const { rows } = await pool.query(`
            SELECT UserId FROM bpUserContainer
            WHERE ContainerId = $1;
          `, [this.id]);

          if (!rows[0])
            throw {
              status: 404,
              message: "No collaborators found.",
            };

          const collaborators = rows.map((record) => {
            return record.userid;
          });

          resolve(collaborators);
        } catch (err) {
          console.log(err);
          reject(err);
        }
      })();
    });
  }

  deleteCollaborator(userId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          await pool.query(`
            DELETE bpUserSourceContainer FROM bpUserSourceContainer
            INNER JOIN bpUserContainer
            ON bpUserSourceContainer.UserContainerId = bpSourceContainer.UserContainerId
            WHERE UserId = $1;
            `, [userId]);

          await pool.query(`
            DELETE FROM bpUserContainer 
            WHERE UserId = $2 AND ContainerId = $1;
          `, [this.id, userId]);

          resolve();
        } catch (err) {
          console.log(err);
          reject(err);
        }
      })();
    });
  }

  //source methods
  addSource(sourceId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const { rows: exists } = await pool.query(`
            SELECT SourceId FROM bpSourceContainer 
            WHERE SourceId = $2 AND ContainerId = $1;
          `, [this.id, sourceId]);

          if (exists[0])
            throw {
              status: 400,
              message: "Source already exists in this container.",
            };

          const { rows: sourcecontainerid} = await pool.query(`
            INSERT INTO bpSourceContainer (SourceId, ContainerId)
            VALUES ($2, $1) RETURNING SourceContainerId;
          `, [this.id, sourceId]);

          if (!sourcecontainerid[0])
            throw {
              status: 500,
              message: "Failed to add source to container.",
            };

          const SourceContainerId = sourcecontainerid[0].sourcecontainerid;

          resolve(SourceContainerId);
        } catch (err) {
          console.log(err);
          reject(err);
        }
      })();
    });
  }

  getSources() {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const { rows } = await pool.query(`
            SELECT SourceId FROM bpSourceContainer
            WHERE ContainerId = $1;
          `, [this.id]);

          if (!rows[0])
            throw {
              status: 404,
              message: "No sources found.",
            };

          const sources = rows.map((record) => {
            return record.sourceid;
          });

          resolve(sources);
        } catch (err) {
          console.log(err);
          reject(err);
        }
      })();
    });
  }

  deleteSource(sourceId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          await pool.query(`
            DELETE bpUserSourceContainer FROM bpUserSourceContainer
            INNER JOIN bpSourceContainer
            ON bpUserSourceContainer.SourceContainerId = bpSourceContainer.SourceContainerId
            WHERE SourceId = $2;

            DELETE FROM bpSourceContainer 
            WHERE SourceId = $2 AND ContainerId = $1;
          `, [this.id, sourceId]);

          resolve();
        } catch (err) {
          console.log(err);
          reject(err);
        }
      })();
    });
  }

  addPermission(UserContainerId, SourceContainerId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const { rows: UserSourceContainer } = await pool.query(`
            INSERT INTO bpUserSourceContainer (UserContainerId, SourceContainerId)
            VALUES ($1, $2) RETURNING UserSourceContainerId;
          `, [UserContainerId, SourceContainerId]);

          if (!UserSourceContainer[0])
            throw {
              status: 500,
              message: "Failed to add permission to source.",
            };

          resolve();
        } catch (err) {
          console.log(err);
          reject(err);
        }
      })();
    });
  }

  getPermissions(sourceId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const { rows: sourceContainerId} = await pool.query(`
            SELECT SourceContainerId FROM bpSourceContainer
            WHERE ContainerId = $2 AND SourceId = $1;
          `, [sourceId, this.id]);

          if (!sourceContainerId[0])
            throw {
              status: 404,
              message: "This source doesn't exist in this container.",
            };

          const SourceContainerId = sourceContainerId[0].sourcecontainerid;

          const { rows: userSourceContainer } = await pool.query(`
            SELECT UserId FROM bpUserSourceContainer
            INNER JOIN bpUserContainer
            ON bpUserSourceContainer.UserContainerId = bpUserContainer.UserContainerId
            WHERE SourceContainerId = $1;
          `, [SourceContainerId]);

          if (!userSourceContainer[0])
            throw {
              status: 404,
              message: "This source has no bound permissions.",
            };

          const users = userSourceContainer.map((record) => {
            return record.userid;
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
      })();
    });
  }

  deletePermission(sourceId, userId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          await pool.query(`
            DELETE FROM bpUserSourceContainer
            INNER JOIN bpSourceContainer
            ON bpUserSourceContainer.SourceContainerId = bpSourceContainer.SourceContainerId
            INNER JOIN bpUserContainer
            ON bpUserSourceContainer.UserContainerId = bpUserContainer.UserContainerId
            WHERE SourceId = $2 and UserId = $1;
          `, [userId, sourceId]);

          resolve();
        } catch (err) {
          console.log(err);
          reject(err);
        }
      })();
    });
  }

  // container CRUD
  static create(containerObj, userObj) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const { rows: container1 } = await pool.query(`
            INSERT INTO bpContainer (ContainerName, UserId)
            VALUES ($1, $2) RETURNING ContainerId;
          `, [containerObj.name, userObj.id]);

          if (!container1[0])
          throw {
            status: 500,
            message: "Failed to save Container to database.",
          };

          const containerId = container1[0].containerid;

          await pool.query(`
            INSERT INTO bpUserContainer (UserId, ContainerId)
            VALUES ($2, $1);
            `, [containerId, userObj.id]);
            
          const { rows: container2 } = await pool.query(`
            SELECT * FROM bpContainer
            WHERE ContainerId = $1;
          `, [containerId]);

          if (!container2[0])
            throw {
              status: 500,
              message: "Failed to save Container to database.",
            };

          const containerRecord = container2[0];

          const newContainer = new Container({
            id: containerRecord.containerid,
            name: containerRecord.containername,
          });

          resolve(newContainer);
        } catch (err) {
          console.log(err);
          reject(err);
        }
      })();
    });
  }

  static readById(containerId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const { rows: container } = await pool.query(`
            SELECT 
            ContainerId, ContainerName, UserId
            FROM bpContainer
            WHERE ContainerId = $1;
          `, [containerId]);

          const { rows: sources } = await pool.query(`
            SELECT SourceId
            FROM bpSourceContainer
            WHERE ContainerId = $1;
          `, [containerId]);

          if (!container[0] || !sources[0]) {
            throw {
              status: 500,
              message: "Failed to get container",
            };
          }
          const record = container[0];

          const containerRecord = new Container({
            id: record.containerid,
            name: record.containername,
            owner: { id: record.userid },
            sources: sources.map((source) => {
              return source.sourceid;
            }),
          });

          resolve(containerRecord);
        } catch (err) {
          console.log(err);
          reject(err);
        }
      })();
    });
  }

  static readAll(userObj) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const { rows } = await pool.query(`
            SELECT DISTINCT 
            bpContainer.ContainerId, bpContainer.ContainerName, bpContainer.UserId 
            FROM bpContainer
            INNER JOIN
            bpUserContainer
            ON bpContainer.ContainerId = bpUserContainer.ContainerId
            WHERE bpUserContainer.UserId = $1;
          `, [userObj.id]);

          if (rows.length < 0)
            throw {
              status: 404,
              message: "No containers found",
            };

          const containers = [];

          if (rows.length > 0) {
            rows.forEach((record) => {
              const containerObj = {
                id: record.containerid,
                name: record.containername,
                owner: { id: record.userid },
              };

              containers.push(new Container(containerObj));
            });
          }

          resolve(containers);
        } catch (err) {
          console.log(err);
          reject(err);
        }
      })();
    });
  }

  update(containerObj, userObj) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const keys = Object.keys(containerObj);

          keys.forEach((key) => {
            this[key] = containerObj[key];
          });

          const { rows } = await pool.query(`
            UPDATE bpContainer
            SET ContainerName = $1
            WHERE ContainerId = $2 AND UserId = $3 RETURNING ContainerId;
          `, [this.id, this.name, userObj.id]);

          if (!rows[0]) {
            throw {
              status: 500,
              message: "Failed to update container",
            };
          }

          if (rows.length != 1) {
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

  static delete(containerId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          await pool.query(`
            DELETE bpUserSourceContainer FROM bpUserSourceContainer
            INNER JOIN bpUserContainer
            ON bpUserSourceContainer.UserContainerId = bpUserContainer.UserContainerId
            WHERE ContainerId = $1;
          `, [containerId]);

          await pool.query(`
            DELETE FROM bpUserContainer
            WHERE ContainerId = $1;
          `, [containerId]);

          await pool.query(`
            DELETE FROM bpSourceContainer
            WHERE ContainerId = $1;
          `, [containerId]);
  
          await pool.query(`
            DELETE FROM bpContainerCategory 
            WHERE ContainerId = $1;
          `, [containerId]);

          await pool.query(`
            DELETE FROM bpContainerTransaction 
            WHERE ContainerId = $1;
          `, [containerId]);

          await pool.query(`
            DELETE FROM bpGoal
            WHERE ContainerId = $1;
          `, [containerId]);

          await pool.query(`
            DELETE FROM bpContainer
            WHERE ContainerId = $1;
          `, [containerId]);

          resolve();
        } catch (err) {
          console.log(err);
          reject(err);
        }
      })();
    });
  }
}

module.exports = Container;
