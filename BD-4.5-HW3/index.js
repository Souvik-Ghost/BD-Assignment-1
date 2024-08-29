let express = require("express");
let app = express();
let port = process.env.PORT || 3000;
let db;
let sqlite3 = require("sqlite3").verbose();
let { open } = require("sqlite");
app.use(express.json());
//Connect to the database
(async () => {
  db = await open({
    filename: "BD-4.5-HW3/database.sqlite",
    driver: sqlite3.Database,
  });
})();
//Message
app.get("/", (req, res) => {
  res.status(200).json({ message: "BD 4.5 HW3 SQL Comparison Operators" });
});
//To connect sqlite database run: /node BD-4.5-HW3/initDB.js
//To run the project: /node BD-4.5-HW3
// THE ENPOINTS
//1 kitchen-items/rating?minRating=4
async function filterKitchenItemsByRating(minRating) {
  let query = "SELECT * FROM kitchen_items WHERE rating >= ?";
  let response = await db.all(query, [minRating]);
  return { kitchenItems: response };
}
app.get("/kitchen-items/rating", async (req, res) => {
  let minRating = req.query.minRating;
  try {
    let results = await filterKitchenItemsByRating(minRating);
    if (results.kitchenItems.length === 0) {
      return res
        .status(404)
        .json({ message: `No items found with the given rating ${minRating}` });
    }
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
//2 kitchen-items/material-rating?material=plastic&minRating=3
async function filterKitchenItemsByMaterialRatingto(material, minRating) {
  let query = "SELECT * FROM kitchen_items WHERE material = ? AND rating >= ?";
  let response = await db.all(query, [material, minRating]);
  return { kitchenItems: response };
}
app.get("/kitchen-items/material-rating", async (req, res) => {
  let material = req.query.material;
  let minRating = req.query.minRating;
  try {
    let results = await filterKitchenItemsByMaterialRatingto(
      material,
      minRating,
    );
    if (results.kitchenItems.length === 0) {
      return res.status(404).json({
        message: `No items found with the given material ${material} and rating ${minRating}`,
      });
    }
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
//3 kitchen-items/ordered-by-price
async function filterKitchenItemsOrderedByPrice() {
  let query = "SELECT * FROM kitchen_items ORDER BY price DESC";
  let response = await db.all(query);
  return { kitchenItems: response };
}
app.get("/kitchen-items/ordered-by-price", async (req, res) => {
  try {
    let results = await filterKitchenItemsOrderedByPrice();
    if (results.kitchenItems.length === 0) {
      return res
        .status(404)
        .json({ message: `No items found in the database.` });
    }
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
//Server Port connection
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
