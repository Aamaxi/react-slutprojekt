const mysql = require("mysql2");
const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "flicks",
  password: "slenderman",
});

app.get("/film", (req, res) => {
  const film_id = req.query.film_id; // Get film_id from query parameter
  console.log("Received film_id:", film_id);

  connection.query("SELECT * FROM films WHERE film_id = ?", [film_id], (err, filmResults) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
    });

  connection.query("SELECT * FROM acted_in WHERE film_id = ?", [film_id], (err, creditsResults) => {
    if (err) {
      res.status(500).json({ error: err.message});
      return;
    }
  });

  res.json({
    film: filmResults,
    credits: creditsResults
  });
});

app.get("/list", (req, res) => {
  const list_id = req.query.list_id;
  console.log("Received list_id: ", list_id);

  // First query to get the list details
  connection.query("SELECT * FROM lists WHERE list_id = ?", [list_id], (err, listResults) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    // Second query to get the films in the list
    connection.query("SELECT * FROM list_films WHERE list_id = ?", [list_id], (err, listFilmsResults) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      // Send the response after both queries complete
      res.json({
        list: listResults,
        listFilms: listFilmsResults,
      });
    });
  });
});

app.listen(5000, () => console.log("Server running at http://localhost:5000"));
