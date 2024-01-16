const Sequelize = require('sequelize');
const sequelize = new Sequelize('wt24', 'root', 'password', {
    host: '127.0.0.1',
    dialect: 'mysql',
    logging: false,
    define:{
        freezeTableName: true
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
//db.sequelize.options.logging = console.log;

db.Korisnik = require('./models/Korisnik')(sequelize, Sequelize);
db.Nekretnina = require('./models/Nekretnina')(sequelize, Sequelize);
db.Upit = require('./models/Upit')(sequelize, Sequelize);


db.Nekretnina.hasMany(db.Upit, { foreignKey: 'nekretnina_id'});
db.Upit.belongsTo(db.Nekretnina, { foreignKey: 'nekretnina_id' });
db.Korisnik.hasMany(db.Upit, { foreignKey: 'korisnik_id' });
db.Upit.belongsTo(db.Korisnik, { foreignKey: 'korisnik_id' });


module.exports = db;