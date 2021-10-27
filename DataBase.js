const { Sequelize } = require('sequelize');

const sequelize = new Sequelize("myWebDb", "root", "12345", {
    dialect: "postgres",
    host: "localhost"
  });

async function startDb(){
    try {
        await sequelize.authenticate();
        console.log('Connected to DB');
        await sequelize.sync();
    } catch (error) {
        console.error('Can not connect ', error);
    }
}

module.exports.sequelize = sequelize;
module.exports.Sequelize = Sequelize;
module.exports.startDb =startDb;