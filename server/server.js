const mysql = require("mysql2");
const express = require("express");
const app = express();
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const SECRET_KEY = "your-secret-key";

app.use(cors());
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000', // your frontend port
  methods: ['GET', 'POST'],
  credentials: true
}));

const upload = multer({
  dest: path.join(__dirname, "uploads"), // Temporary folder for uploaded files
});

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "flicks",
  password: "slenderman",
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

      // Insert the user into the database with the hashed password
      const query = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
      connection.query(query, [username, email, hashedPassword], (err, results) => {
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

      // Generate JWT
      const token = jwt.sign(
        { id: user.user_id, email: user.email, username: user.username },
        SECRET_KEY,
        { expiresIn: "3h" } // Token expires in 1 hour
      );
      // Successful login
      res.status(200).json({ message: "Login successful!", token, username: user.username });
    });
  });
});

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ error: "Access denied." });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token." });
    req.user = user; // Attach user info to the request
    next();
  });
};

// Protected route example
app.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route.", user: req.user });
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

app.get("/film_images", (req, res) => {
  const filmId = req.query.film_id; // Get film_id from the query parameter
  const personId = req.query.person_id; // Get person_id from the query parameter

  // Determine the folder path based on the provided parameter
  let folderPath;
  if (filmId) {
    folderPath = path.join(__dirname, "..", "public", "film_images", filmId);
  } else if (personId) {
    folderPath = path.join(__dirname, "..", "public", "person_images", personId);
  } else {
    return res.status(400).json({ error: "Either film_id or person_id must be provided." });
  }

  // Check if the folder exists
  if (!fs.existsSync(folderPath)) {
    return res.status(404).json({ error: "Folder not found" });
  }

  // Read all files in the folder
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read folder" });
    }

    // Filter only image files (optional)
    const imageFiles = files.filter((file) =>
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    );

    // Return the list of image file paths
    const imagePaths = imageFiles.map((file) =>
      `/${filmId ? "film_images" : "person_images"}/${filmId || personId}/${file}`
    );
    res.json({ images: imagePaths });
  });
});


app.get("/user_lists", authenticateToken, (req, res) => {
  console.log("lskdjfsldkjf lkjsdlkj")
  const userId = req.user.id;

  const query = `
    SELECT lists.list_id, lists.name, lists.description
    FROM lists
    INNER JOIN user_lists ON lists.list_id = user_lists.list_id
    WHERE user_lists.user_id = ?
  `;

  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching user lists:", err);
      return res.status(500).json({ error: "Failed to fetch user lists." });
    }

    res.status(200).json({ lists: results });
  });
});


app.post("/create_list", authenticateToken, upload.single("image"), (req, res) => {
  console.log("lksdjflkjsd fjfsdjkhsfd hjksdfjhkfdsjjkfh")
  const { header, description } = req.body;
  const image = req.file;
  const userId = req.user.id;

  if (!header || !description || !image) {
    return res.status(400).json({ error: "All fields are required." });
  }

  // Insert the list into the database
  const query = `
    INSERT INTO lists (name, description)
    VALUES (?, ?)
  `;

  connection.query(query, [header, description], (err, results) => {
    if (err) {
      console.error("Error inserting list:", err);
      return res.status(500).json({ error: "Failed to create list." });
    }

    const listId = results.insertId; // Get the ID of the newly created list
    const extension = path.extname(image.originalname); // Get the file extension (e.g., .jpg, .png)
    const newFileName = `${listId}${extension}`; // Rename the file to "id.extension"
    const newFilePath = path.join(__dirname, "..", "public", "list_images", newFileName);

    // Move the file to the "list_images" folder
    fs.rename(image.path, newFilePath, (err) => {
      if (err) {
        console.error("Error moving file:", err);
        return res.status(500).json({ error: "Failed to save image." });
      }

      // Insert the user_id and list_id into the user_lists table
      const userListsQuery = `
        INSERT INTO user_lists (user_id, list_id)
        VALUES (?, ?)
      `;

      connection.query(userListsQuery, [userId, listId], (err) => {
        if (err) {
          console.error("Error inserting into user_lists:", err);
          return res.status(500).json({ error: "Failed to associate user with list." });
        }

        res.status(201).json({ message: "List created successfully!", listId });
      });
    });
  });
});

app.get("/addtolist", authenticateToken,  (req, res) => {
  const userId = req.user.id;

  connection.query("SELECT * FROM lists", (err, listsResults) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    connection.query("SELECT * FROM user_lists WHERE user_id = ?", [userId], (err, userResults) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      connection.query("SELECT * FROM list_films", (err, listFilmsResults) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
    

        res.json({
          lists: listsResults,
          userLists: userResults,
          listFilms: listFilmsResults
        })  
      })
    })
  })
})

app.post("/changelist", (req, res) => {
  const { selectedLists, filmId } = req.body;

  console.log("Selected Lists:", selectedLists);
  console.log("Film ID:", filmId);

  // Loop through the selectedLists array
  selectedLists.forEach((action) => {
    if (action.added) {
      // If the action is "added", insert into the list_films table
      connection.query(
        "INSERT INTO list_films (list_id, film_id) VALUES (?, ?)",
        [action.added, filmId],
        (err, results) => {
          if (err) {
            console.error("Error adding film to list:", err);
            return res.status(500).json({ error: "Failed to add film to list." });
          }
          console.log(`Film added to list_id ${action.added}`);
        }
      );
    } else if (action.deleted) {
      // If the action is "deleted", delete from the list_films table
      connection.query(
        "DELETE FROM list_films WHERE list_id = ? AND film_id = ?",
        [action.deleted, filmId],
        (err, results) => {
          if (err) {
            console.error("Error removing film from list:", err);
            return res.status(500).json({ error: "Failed to remove film from list." });
          }
          console.log(`Film removed from list_id ${action.deleted}`);
        }
      );
    }
  });

  // Send a success response after processing all actions
  res.status(200).json({ message: "Changes processed successfully." });
});

app.post("/reviews", authenticateToken, (req, res) => {
  const { film_id, header, description, rating } = req.body;
  user_id = req.user.id;

  if (!user_id || !film_id || !header || !description || !rating) {
    return res.status(400).send("All fields are required.");
  }

  const query = `
    INSERT INTO reviews (user_id, film_id, header, description, number_rating)
    VALUES (?, ?, ?, ?, ?)
  `;

  connection.query(query, [user_id, film_id, header, description, rating], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Failed to add review.");
    }
    res.status(200).send("Review added successfully.");
  });
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



app.listen(5000, () => console.log("Server running at http://localhost:5000"));
