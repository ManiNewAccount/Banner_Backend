const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors = require('cors'); // Import the cors package

dotenv.config();

const app = express();
const port = 5000; // Port for your API

app.use(cors()); // Use the cors middleware
app.use(express.json()); // Middleware to parse JSON request bodies

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1); // Exit if connection fails
  }
  console.log('Connected to the database.');
});

app.get('/api/getbanner-settings', (req, res) => {
  const query = 'SELECT * FROM banner_settings WHERE id = 1';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching banner settings:', err);
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(204).json({ error: 'Banner settings not found' });
    }
    res.status(200).json(results[0]);
  });
});

// API Endpoint to update banner settings
app.put('/api/banner-settings', (req, res) => {
  const { visible, description, timer, link, descriptionFont, descriptionColor, timerFont, timerColor } = req.body;

  const sanitizedValues = [
    visible ?? false,
    description ?? '',
    timer?.days ?? 0,
    timer?.hours ?? 0,
    timer?.minutes ?? 0,
    timer?.seconds ?? 0,
    link ?? '',
    descriptionFont ?? 'Lato',
    descriptionColor ?? '#ffff',
    timerFont ?? 'Lato',
    timerColor ?? '#ffff'
  ];

  const query = `
    UPDATE banner_settings
    SET 
      visible = ?, 
      description = ?, 
      days = ?, 
      hours = ?, 
      minutes = ?, 
      seconds = ?, 
      link = ?, 
      descriptionFont = ?, 
      descriptionColor = ?, 
      timerFont = ?, 
      timerColor = ?
    WHERE id = 1`;

  connection.query(query, sanitizedValues, (err, results) => {
    if (err) {
      console.error('Error updating banner settings:', err);
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: 'Banner settings updated successfully' });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// create database bannerDetails;
// use bannerDetails;

// CREATE TABLE banner_settings (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     visible BOOLEAN NOT NULL,
//     description TEXT,
//     days INT DEFAULT 0,
//     hours INT DEFAULT 0,
//     minutes INT DEFAULT 0,
//     seconds INT DEFAULT 0,
//     link VARCHAR(255),
//     image BLOB, -- Use VARCHAR if storing URL or path
//     descriptionFont VARCHAR(100) DEFAULT 'Lato',
//     descriptionColor VARCHAR(7) DEFAULT '#ffffff',
//     timerFont VARCHAR(100) DEFAULT 'Lato',
//     timerColor VARCHAR(7) DEFAULT '#ffffff'
//   );
