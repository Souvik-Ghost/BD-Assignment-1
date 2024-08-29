let express = require("express");
let app = express();
let port = process.env.PORT || 3000;
let db;
let sqlite3 = require("sqlite3").verbose();
let { open } = require("sqlite");
//let cors = require("cors");
//app.use(cors());
app.use(express.json());
//Connect to the database
(async () => {
  db = await open({
    filename: "BD-Assignments/BD-Assignment-1/database.sqlite",
    driver: sqlite3.Database,
  });
})();
//Message
app.get("/", (req, res) => {
  res.status(200).json({ message: "BD 4.5 HW2 SQL Comparison Operators" });
});
//To connect sqlite database run: /node BD-Assignments/BD-Assignment-1/initDB.js
//To run the project: /node BD-Assignments/BD-Assignment-1
// THE ENPOINTS
//1 /restaurants
async function getAllRestaurants() {
  let query = "SELECT * FROM restaurants";
  let response = await db.all(query);
  return { restaurants: response };
}
app.get("/restaurants", async (req, res) => {
  try {
    let results = await getAllRestaurants();
    if (results.restaurants.length === 0) {
      return res.status(404).json({ message: "No restaurants found" });
    }
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
//2 /restaurants/details/1
async function getRestaurantByID(id) {
  let query = "SELECT * FROM restaurants WHERE id = ?";
  let response = await db.get(query, id);
  return { restaurant: response };
}
app.get("/restaurants/details/:id", async (req, res) => {
  let id = parseInt(req.params.id);
  try {
    let results = await getRestaurantByID(id);
    if (!results.restaurant) {
      return res
        .status(404)
        .json({ message: `No restaurant found of this id: ${id}` });
    }
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
//3 /restaurants/cuisine/Indian
async function getRestaurantsByCuisine(cuisine) {
  let query = "SELECT * FROM restaurants WHERE cuisine = ?";
  let response = await db.all(query, [cuisine]);
  return { restaurants: response };
}
app.get("/restaurants/cuisine/:cuisine", async (req, res) => {
  let cuisine = req.params.cuisine;
  try {
    let results = await getRestaurantsByCuisine(cuisine);
    if (results.restaurants.length === 0) {
      return res
        .status(404)
        .json({ message: `No restaurants found of this cuisine: ${cuisine}` });
    }
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
//4 /restaurants/filter?isVeg=true&hasOutdoorSeating=true&isLuxury=false
async function getRestaurantsByFilter(isVeg, hasOutdoorSeating, isLuxury) {
  let query =
    "SELECT * FROM restaurants WHERE isVeg = ? AND hasOutdoorSeating = ? AND isLuxury = ?";
  let response = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]);
  return { restaurants: response };
}
app.get("/restaurants/filter", async (req, res) => {
  let isVeg = req.query.isVeg;
  let hasOutdoorSeating = req.query.hasOutdoorSeating;
  let isLuxury = req.query.isLuxury;
  try {
    let results = await getRestaurantsByFilter(
      isVeg,
      hasOutdoorSeating,
      isLuxury,
    );
    if (results.restaurants.length === 0) {
      return res.status(404).json({
        message: `No restaurants found with all these things: ${isVeg}, ${hasOutdoorSeating}, and ${isLuxury}`,
      });
    }
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
//5 /restaurants/sort-by-rating
async function getRestaurantsByRating(rating) {
  let query =
    "SELECT * FROM restaurants WHERE rating >= ? ORDER BY rating DESC";
  let response = await db.all(query, [rating]);
  return { restaurants: response };
}
app.get("/restaurants/sort-by-rating", async (req, res) => {
  let rating = parseFloat(req.query.rating);
  try {
    let results = await getRestaurantsByRating(rating);
    if (results.restaurants.length === 0) {
      return res.status(404).json({
        message: `No restaurants found with this much rating: ${rating}`,
      });
    }
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
//6 /dishes
async function getAllDishes() {
  let query = "SELECT * FROM dishes";
  let response = await db.all(query);
  return { dishes: response };
}
app.get("/dishes", async (req, res) => {
  try {
    let results = await getAllDishes();
    if (results.dishes.length === 0) {
      return res.status(404).json({ message: "No dishes found" });
    }
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
//7 /dishes/details/1
async function getDishByID(id) {
  let query = "SELECT * FROM dishes WHERE id = ?";
  let response = await db.get(query, [id]);
  return { dish: response };
}
app.get("/dishes/details/:id", async (req, res) => {
  let id = parseInt(req.params.id);
  try {
    let results = await getDishByID(id);
    if (!results.dish) {
      return res
        .status(404)
        .json({ message: `No dish found of this id: ${id}` });
    }
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
//8 /dishes/filter?isVeg=true
async function getDishesByFilter(isVeg) {
  let query = "SELECT * FROM dishes WHERE isVeg = ?";
  let response = await db.all(query, [isVeg]);
  return { dishes: response };
}
app.get("/dishes/filter", async (req, res) => {
  let isVeg = req.query.isVeg;
  try {
    let results = await getDishesByFilter(isVeg);
    if (results.dishes.length === 0) {
      return res
        .status(404)
        .json({ message: `No dishes found with this type: ${isVeg}` });
    }
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
//9 /dishes/sort-by-price
async function getDishesByPrice(price) {
  let query = "SELECT * FROM dishes WHERE price <= ? ORDER BY price DESC";
  let response = await db.all(query, [price]);
  return { dishes: response };
}
app.get("/dishes/sort-by-price", async (req, res) => {
  let price = parseFloat(req.query.price);
  try {
    let results = await getDishesByPrice(price);
    if (results.dishes.length === 0) {
      return res
        .status(404)
        .json({ message: `No dishes found with this price: ${price}` });
    }
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
//Server Port connection Message
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
