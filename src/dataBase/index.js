const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  port: 5432,
  dialect: "postgres",
  host: "localhost",
  database: "myWebDb",
  username: "root",
  password: "12345",
});

async function initDB() {
  try {
    await sequelize.authenticate();
    // await sequelize.dropSchema("public", {});
    // await sequelize.createSchema("public", {});
    await sequelize.sync();
    console.log("Connected to DB");
  } catch (error) {
    console.error("Can not connect ", error);
  }
}

module.exports = {
  sequelize,
  initDB,
};
