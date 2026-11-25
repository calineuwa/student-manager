
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Student Registration API is running!');
});

app.get('/students', (req, res) => {
    db.query('SELECT * FROM students', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.json(results);
    });
});

app.post('/students', (req, res) => {
    const { name, age, course } = req.body;

    if (!name || !Number.isInteger(age) || age < 1 || !course) {
        return res.status(400).json({
            message: 'Enter a valid name, age and course'
        });
    }

    const sql = 'INSERT INTO students (name, age, course) VALUES (?, ?, ?)';

    db.query(sql, [name, age, course], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.status(201).json({
            message: 'Student added successfully',
            id: result.insertId
        });
    });
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
