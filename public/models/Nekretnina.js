const Sequelize = require("sequelize");

module.exports = function(sequelize, DataTypes) {
  const Nekretnina = sequelize.define("Nekretnina", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tip_nekretnine: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    naziv: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    kvadratura: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cijena: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tip_grijanja: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lokacija: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    godina_izgradnje: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    datum_objave: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    opis: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    pretrage: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      klikovi: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
  });

  // Definiranje asocijacije sa tabelom "Upiti"
  //Nekretnina.hasMany(sequelize.models.Upit, { foreignKey: 'nekretnina_id' });

  return Nekretnina;
};
