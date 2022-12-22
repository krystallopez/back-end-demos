const express = require('express');
const app = express();
const { Dog } = require('./db');
const { sequelize } = require('./db/db');
const { Op } = require('sequelize');


app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.post('/dogs', async (req, res, next) => {
  try {
    const {name, breed, color, description} = req.body;
    const dog = await Dog.create({name, breed, color, description});
    res.send(dog);
  } catch (error) {
    next(error);
  }
});

app.delete('/dogs/:id', async (req, res, next) => {
  try {
    const {id} = req.params;
    const existingDog = await Dog.findByPk(id);
    if(!existingDog) {
      res.status(404).send(`Dog with id ${id} not found`);
      return;
    }
    await Dog.destroy({where: {id}});
    res.send(`deleted dog with id ${id}`);
  } catch (error) {
    next(error);
  }
});

app.get('/dogs', async (req, res, next) => {
  try {
    //TO DO
    res.send("need to complete this GET route");
  } catch (error) {
    next(error)
  }
});

const { PORT = 4000 } = process.env;

app.listen(PORT, () => {
  sequelize.sync({ force: false });
  console.log(`Dogs are ready at http://localhost:${PORT}`);
});
