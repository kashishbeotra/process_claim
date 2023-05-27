const express = require('express');
const mysql = require('mysql');
const ejs = require('ejs');
const multer = require('multer');
const bodyParser = require('body-parser');


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Create a MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  database: 'claim_process',
  user: 'root',
  password: '12345'
});

// Connect to the MySQL server
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as ID: ' + connection.threadId);
});

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});

const upload = multer({ storage: storage });

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/fetch-data', (req, res) => {
  const memberId = req.query.memberId;

  const query = 'SELECT * FROM user WHERE member_id = ?';
  connection.query(query, [memberId], (error, results) => {
    if (error) {
      console.error('Error executing query: ' + error.stack);
      res.status(500).send('Error executing query');
      return;
    }

    res.render('member', { member: results[0] });
  });
});

app.post('/submit-claim', upload.array('document', 3), (req, res) => {
  const memberId = req.query.memberId;
  const documents = req.files;

  // Calculate the Amount Avail Date
  const requestDate = new Date();
  const amountAvailDate = new Date(requestDate.setDate(requestDate.getDate() + 10));

  // Insert the documents into the database
  const query = 'UPDATE user SET document1 = ?, document2 = ?, document3 = ?, process_claim = ? WHERE member_id = ?';
  connection.query(query, [documents[0].filename, documents[1].filename, documents[2].filename, 'approved', memberId], (error, results) => {
    if (error) {
      console.error('Error executing query: ' + error.stack);
      res.status(500).send('Error executing query');
      return;
    }

    // Render the success message
    res.render('success', { message: 'Files submitted successfully!', member: { amount_avail_date: amountAvailDate } });
  });
});


app.post('/update-claim-status', (req, res) => {
  const memberId = req.query.memberId;
  const claimStatus = req.body.claimStatus; // Updated the variable name here

  // Update the claim status in the database
  const query = 'UPDATE user SET process_claim = ? WHERE member_id = ?';
  connection.query(query, [claimStatus, memberId], (error, results) => {
    if (error) {
      console.error('Error executing query: ' + error.stack);
      res.status(500).send('Error executing query');
      return;
    }

    // Redirect to the member details page
    res.redirect(`/fetch-data?memberId=${memberId}`);
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
