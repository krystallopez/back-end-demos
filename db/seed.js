const {sequelize} = require('./db');
const {Dog} = require('./');
const { dogs } = require('./seedData');

const seed = async () => {
  await sequelize.sync({ force: true }); // recreate db
  await Dog.bulkCreate(dogs);
};

seed()
  .then(() => {
    console.log('Seeding success. Arf!');
  })
  .catch(err => {
    console.error(err);
  })
  .finally(() => {
    sequelize.close();
  });
