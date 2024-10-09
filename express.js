const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(express.json());

app.get('/home', (req, res) => {
    console.log("Received request for /home");
    res.sendFile(path.join(__dirname, 'home.html'));
});


app.get('/profile', (req, res) => {
    fs.readFile('./user.json', 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return res.status(500).json({ message: 'Error reading file' });
        }
        res.json(JSON.parse(data));
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    fs.readFile('./user.json', 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return res.status(500).json({ message: 'Error reading file' });
        }

        const user = JSON.parse(data); 

        if (user.username !== username) {
            return res.json({ status: false, message: 'User Name is invalid' });
        }
        if (user.password !== password) {
            return res.json({ status: false, message: 'Password is invalid' });
        }

     
        res.json({ status: true, message: 'User Is valid' });
    });
});

app.get('/logout/:username', (req, res) => {
    const { username } = req.params;
    res.send(`<b>${username} successfully logged out.</b>`);
});

app.use((err, req, res, next) => {
    console.error("Server Error:", err);
    res.status(500).send('Server Error');
});

// Start the server
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
