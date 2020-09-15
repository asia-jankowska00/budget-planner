const connection = require("../config/connection");
const sql = require("mssql");

class Container {
  constructor(container) {
    this.id = container.id;
    this.name = container.name;
    this.ownerId = container.ownerId;
    this.sources = container.sources;
    this.collaborators = container.collaborators;
    this.categories = container.categories;
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
          console.log(containerId);

          input.sources.forEach(async (sourceId) => {
            // check if source exists

            await sql.close();

            const pool = await sql.connect(connection);
            const sourceResult = await pool
              .request()
              .input("SourceId", sql.NVarChar, sourceId).query(`
                    SELECT SourceId
                    FROM bpSource
                    WHERE SourceId = @SourceId;
                `);

            // if not, throw error
            if (!sourceResult.recordset[0])
              throw {
                status: 404,
                message: "Given source not found.",
              };

            // if yes, proceed with inserting into ContainerSource
            await pool
              .request()
              .input("SourceId", sql.NVarChar, sourceId)
              .input("ContainerId", sql.NVarChar, containerId).query(`
            INSERT INTO bpContainerSource (ContainerId, SourceId)
            VALUES (@ContainerId, @SourceId);
              `);
          });

          //   const pool2 = await sql.connect(connection);
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

          console.log(finalResult);
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
