const Sequelize = require("sequelize");
const { sequelize } = require("..");

class ToDo extends Sequelize.Model {}

ToDo.init(
  {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: Sequelize.DataTypes.UUIDV4,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: "",
    },
    isDone: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isFavourite: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    priority: {
      type: Sequelize.SMALLINT,
      defaultValue: 1,
    },
  },
  { sequelize: sequelize, underscored: true, modelName: "todo", timestamps: false }
);

module.exports = ToDo;
