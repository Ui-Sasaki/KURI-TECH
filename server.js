const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// List of hospitals
const hospitals = [
    { id: 'hospital1', name: 'hospital1' },
    { id: 'hospital2', name: 'hospital2' },
    { id: 'hospital3', name: 'hospital3' }
];

// Hardcoded users with hospital association
const users = [
    { username: 'doctor1', hospital_id: 'hospital1', password: 'pass1' },
    { username: 'doctor2', hospital_id: 'hospital2', password: 'pass2' },
    { username: 'doctor3', hospital_id: 'hospital3', password: 'pass3' }
];

// Endpoint to provide hospital list
app.get('/hospitals', (req, res) => {
    res.json(hospitals);
});

// Handle login
app.post('/submit_doctor_login', (req, res) => {
    const { username, hospital_id, password } = req.body;

    const user = users.find(
        u => u.username === username && u.hospital_id === hospital_id && u.password === password
    );

    if (user) {
        res.send(`<h1>Welcome, ${user.username}!</h1><p>You are logged in at ${hospitals.find(h => h.id === hospital_id).name}.</p>`);
    } else {
        res.send('<h1>Invalid credentials or hospital. Please try again.</h1>');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
