
const mysql = require("mysql2");
const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors())

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "flicks",
  password: "slenderman"
})

app.get("/film", (req, res) => {
  connection.query("SELECT * FROM films", (err, results) => {
    if (err) {
      res.status(500).json({error: err.message});
      return;
    }
    res.json(results);
  });
});



app.listen(5000, () => console.log("Server running at 5000"));


/*
connection.query("SELECT * FROM `acted_in`;", function(err, results){
  if (err) {
    console.error("error executing query", err)
  } else {
    console.log("Query results:", results)
  }


});
*/


/*
GET /home → hämtar filmer från watchlist


POST /createlist → Skapa ny lista
DELETE /film → ta bort film från lista
POST /film → lägg till film i lista

GET /home → hämta filmer från watchlist
GET /list?id=... → ska skicka specifik lista
GET /film?id=... → ska skicka specifik film
GET /person?id=... → ska skicka specifik person
*/