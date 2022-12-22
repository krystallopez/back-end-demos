const express = require("express");
const app = express();
const { Dog } = require("./db");
const { sequelize } = require("./db/db");
const { Op } = require("sequelize");

// RESTful is our acrhitectural style for organizing routes, and connecting routes to methods

/* good examples: 
[VERB /noun => description]
GET /users => shows all users 
GET/users/4 => shows single user (id = 4 in db)
POST /users => create new user in db
PUT /users/4 => update the user at with id = 4 in db
DELETE /users/4 => delete user 4 from db 
    note: always use plural for consistency
*/

/* 
Initiated by ?
Separated by &
Key-value pairs joined by =
*/

// Resources for query strings
//Sequelize symbol operators
// https://stackabuse.com/using-sequelize-orm-with-nodejs-and-express/
// https://sequelize.org/v5/manual/querying.html
// https://dev.to/projectescape/the-comprehensive-sequelize-cheatsheet-3m1m#operators

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// RESTful Routes (CRUD)

//Gets all dogs
app.post("/dogs", async (req, res, next) => {
  try {
    const { name, breed, color, description } = req.body;
    const dog = await Dog.create({ name, breed, color, description });
    res.send(dog);
  } catch (error) {
    next(error);
  }
});

// Deletes an instance of dog
app.delete("/dogs/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const existingDog = await Dog.findByPk(id);
    if (!existingDog) {
      res.status(404).send(`Dog with id ${id} not found`);
      return;
    }
    await Dog.destroy({ where: { id } });
    res.send(`deleted dog with id ${id}`);
  } catch (error) {
    next(error);
  }
});

// Get all dogs with specific paramaters
app.get("/dogs", async (req, res, next) => {
  try {
    // Creating a where object to build in the search queries
    const where = {};
    //loop through all of the possile queries (in array form)
    const queriesArray = ["name", "description","breed","color" ]
    for (const key of queriesArray){ // using a for...of loop
      //check if a specific query string param is inside the req.body
      if (req.query[key]) {
        // if it does exist then add to where object and create options 
        where[key] = {
          [Op.like]: `%${req.query[key]}%` // Using symbol operators to search for any string containing what is inside that specific parameter
        }
      }

    }
    const dogs = await Dog.findAll({
      where
    });
    res.send(dogs);
  } catch (error) {
    next(error);
  }
});

const { PORT = 4000 } = process.env;

app.listen(PORT, () => {
  sequelize.sync({ force: false });
  console.log(`Dogs are ready at http://localhost:${PORT}`);
});
