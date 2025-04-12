const mysql = require("mysql2");
const express = require("express");
const app = express();
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY ="your-secret-key";

app.use(cors());
app.use(express.json())

app.use(cors({
  origin: 'http://localhost:3000', // your frontend port
  methods: ['GET', 'POST'],
  credentials: true
}));

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "flicks",
  password: "slenderman",
});

app.get("/film", (req, res) => {
  const film_id = req.query.film_id; // Get film_id from query parameter

  // First query to get film details
  connection.query("SELECT * FROM films WHERE film_id = ?", [film_id], (err, filmResults) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    // Second query to get credits for the film
    connection.query("SELECT * FROM acted_in WHERE film_id = ?", [film_id], (err, actedResults) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      connection.query("SELECT * FROM directed_in WHERE film_id = ?", [film_id], (err, directedResults) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }

        connection.query("SELECT * FROM produced_in WHERE film_id = ?", [film_id], (err, producedResults) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }

          connection.query("SELECT * FROM written_in WHERE film_id = ?", [film_id], (err, writtenResults) => {
            if (err) {
              res.status(500).json({ error: err.message });
              return;
            }

            connection.query("SELECT * FROM people", [film_id], (err, peopleResults) => {
              if (err) {
                res.status(500).json({ error: err.message });
                return;
              }

              connection.query("SELECT * FROM reviews", [film_id], (err, reviewsResults) => {
                if (err) {
                  res.status(500).json({ error: err.message });
                  return;
                }

                connection.query("SELECT * FROM users", [film_id], (err, usersResults) => {
                  if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                  }

                  // Combine all credits into a single object
                  const creditsResults = {
                    acted: actedResults,
                    directed: directedResults,
                    produced: producedResults,
                    written: writtenResults
                  };

                  // Send the response after all queries complete
                  res.json({
                    film: filmResults[0], // Assuming filmResults is an array with one item
                    credits: creditsResults,
                    people: peopleResults,
                    reviews: reviewsResults,
                    users: usersResults
                  });
                });
              });
            }); // Closing for connection.query("SELECT * FROM people")
          }); // Closing for connection.query("SELECT * FROM written_in")
        }); // Closing for connection.query("SELECT * FROM produced_in")
      }); // Closing for connection.query("SELECT * FROM directed_in")
    }); // Closing for connection.query("SELECT * FROM acted_in")
  }); // Closing for connection.query("SELECT * FROM films")
});


app.get("/list", (req, res) => {
  const list_id = req.query.list_id;

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

      connection.query("SELECT * FROM films", [list_id], (err, filmsResults) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
  

        // Send the response after both queries complete
        res.json({
          list: listResults,
          listFilms: listFilmsResults,
          films: filmsResults
        });
      });
    });
  });
});

app.get("/person", (req, res) => {
  const person_id = req.query.person_id;

  connection.query("SELECT * FROM acted_in WHERE person_id = ?", [person_id], (err, actedResults) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    connection.query("SELECT * FROM directed_in WHERE person_id = ?", [person_id], (err, directedResults) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      connection.query("SELECT * FROM produced_in WHERE person_id = ?", [person_id], (err, producedResults) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        connection.query("SELECT * FROM written_in WHERE person_id = ?", [person_id], (err, writtenResults) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          connection.query("SELECT * FROM films", (err, filmsResults) => {
            if (err) {
              res.status(500).json({ error: err.message });
              return;
            }
            connection.query("SELECT * FROM people WHERE person_id = ?", [person_id], (err, personResults) => {
              if (err) {
                res.status(500).json({ error: err.message });
                return;
              }

              const creditsResults = {
                actor: actedResults,
                director: directedResults,
                producer: producedResults,
                writter: writtenResults,
              };

              res.json({
                credits: creditsResults,
                films: filmsResults,
                person: personResults
              });
            });
          });
        });
      });
    });
  });
});


app.get("/search", (req, res) => {
  connection.query("SELECT * FROM films", (err, filmsResults) => {
    if (err) {
      res.status(500).json({ err: err.message })
      return;
    }
    connection.query("SELECT * FROM people", (err, peopleResults) => {
      if (err) {
        res.status(500).json({ err: err.message })
        return;
      }

      res.json({
        films: filmsResults,
        people: peopleResults
      })
    });
  });
});


app.post("/register", (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400).json({ error: "All fields are required." });
    return;
  }

  // Generate a salt and hash the password
  bcrypt.genSalt(10, (saltError, salt) => {
    if (saltError) {
      console.error("Error generating salt:", saltError);
      res.status(500).json({ error: "Failed to generate salt." });
      return;
    }

    bcrypt.hash(password, salt, (hashError, hashedPassword) => {
      if (hashError) {
        console.error("Error hashing password:", hashError);
        res.status(500).json({ error: "Failed to hash password." });
        return;
      }

      // Insert the user into the database with the hashed password and salt
      const query = "INSERT INTO users (username, email, password, salt) VALUES (?, ?, ?, ?)";
      connection.query(query, [username, email, hashedPassword, salt], (err, results) => {
        if (err) {
          console.error("Error inserting user:", err);
          res.status(500).json({ error: "Failed to create account." });
          return;
        }

        res.status(201).json({ message: "Account created successfully!" });
      });
    });
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "All fields are required." });
    return;
  }

  // Query the database for the user by email
  const query = "SELECT * FROM users WHERE email = ?";
  connection.query(query, [email], (err, results) => {
    if (err) {
      console.error("Error querying database:", err);
      res.status(500).json({ error: "Database error." });
      return;
    }

    if (results.length === 0) {
      res.status(401).json({ error: "Invalid email or password." });
      return;
    }
    console.log("results: ", results)
    const user = results[0];

    // Compare the provided password with the hashed password in the database
    bcrypt.compare(password, user.password, (bcryptErr, isMatch) => {
      if (bcryptErr) {
        console.error("Error comparing passwords:", bcryptErr);
        res.status(500).json({ error: "Failed to log in." });
        return;
      }

      if (!isMatch) {
        res.status(401).json({ error: "Invalid email or password." });
        return;
      }

      // Successful login
      res.status(200).json({ message: "Login successful!", user: { id: user.id, username: user.username, email: user.email } });
      
    });
  });
  });



app.listen(5000, () => console.log("Server running at http://localhost:5000"));
