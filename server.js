const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "eco_tourism",
  password: "postgres123",
  port: 5432,
});

pool.connect()
  .then(() => console.log("✅ Database Connected"))
  .catch(err => console.error("❌ DB Error:", err));

app.get("/", (req, res) => {
  res.send("Eco Tourism API Running 🚀");
});

app.get("/places", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id,name,district,category,description,entry_fee,rating FROM places ORDER BY rating DESC NULLS LAST"
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching places" });
  }
});

app.get("/places/search/:keyword", async (req, res) => {
  try {
    const keyword = req.params.keyword;
    const result = await pool.query(
      "SELECT id,name,district,category,rating FROM places WHERE LOWER(name) LIKE LOWER($1)",
      [`%${keyword}%`]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Search Failed" });
  }
});

app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const check = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (check.rows.length > 0)
      return res.status(409).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users(name,email,password) VALUES($1,$2,$3)",
      [name, email, hashed]
    );

    res.json({ message: "Signup Successful" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Signup Failed" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (result.rows.length === 0)
      return res.status(401).json({ message: "Invalid Email" });

    const user = result.rows[0];

    const match = await bcrypt.compare(password, user.password);

    if (!match)
      return res.status(401).json({ message: "Invalid Password" });

    res.json({ message: "Login Successful" });

  } catch (error) {
    res.status(500).json({ message: "Login Failed" });
  }
});

app.post("/book", async (req, res) => {
  try {
    const { name, email, place_name, members, travel_date } = req.body;

    const result = await pool.query(
      `INSERT INTO bookings
       (name,email,place_name,members,travel_date,payment_status,booking_status)
       VALUES($1,$2,$3,$4,$5,'Paid','Confirmed')
       RETURNING id`,
      [name, email, place_name, members, travel_date]
    );

    res.json({
      message: "Booking Confirmed",
      bookingId: result.rows[0].id
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Booking Failed" });
  }
});

app.post("/cancel", async (req, res) => {
  try {
    const { booking_id, email } = req.body;

    await pool.query(
      `UPDATE bookings
       SET booking_status='Cancelled',
           payment_status='Refunded'
       WHERE id=$1 AND email=$2`,
      [booking_id, email]
    );

    res.json({ message: "Booking Cancelled & Refunded" });

  } catch (error) {
    res.status(500).json({ message: "Cancel Failed" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});