const Sequelize = require("sequelize");
const { sequelize } = require("..");

class Token extends Sequelize.Model {}

Token.init(
  {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: Sequelize.DataTypes.UUIDV4,
    },
    value: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  { sequelize: sequelize, underscored: true, modelName: "token" }
);

module.exports = Token;
