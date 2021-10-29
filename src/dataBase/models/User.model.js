const Sequelize = require("sequelize");
const { sequelize } = require("..");
const ToDo = require("./ToDo.model");
const Token = require("./Token.model");

class User extends Sequelize.Model {}

User.init(
  {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: Sequelize.DataTypes.UUIDV4,
    },
    login: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: "",
    },
  },
  { sequelize: sequelize, underscored: true, modelName: "user" }
);

User.hasMany(Token);
Token.belongsTo(User, { foreignKey: "userId" });
User.hasMany(ToDo);
ToDo.belongsTo(User, { foreignKey: "userId" });

module.exports = User;
