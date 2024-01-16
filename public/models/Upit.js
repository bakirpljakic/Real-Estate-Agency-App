const Sequelize = require("sequelize");

module.exports = function(sequelize, DataTypes) {
  const Upit = sequelize.define("Upit", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    korisnik_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tekst_upita: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    nekretnina_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
  });
  return Upit;
};

