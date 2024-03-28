import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  password: "12345",
  port: "5432",
  database: "secrets",
});

db.connect()
  .then(() => {
    console.log("postgre database connected");
  })
  .catch((err) => {
    console.log("error in connecting to database", err);
  });

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  try {
    await db.query("INSERT INTO users (email,password) VALUES ($1,$2)", [
      username,
      password,
    ]);
    res.redirect("/login");
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  try {
    const result = await db.query("SELECT * FROM users WHERE email=$1 ", [
      username,
    ]);
    if (
      result.rows[0].email === username &&
      result.rows[0].password === password
    ) {
      res.redirect("/");
    } else {
      res.redirect("/register");
    }
  } catch (error) {
    console.error(error);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
