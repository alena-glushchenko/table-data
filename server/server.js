const express = require('express');
const cors = require('cors');
const csv = require('csv-parser');
const Database = require('better-sqlite3');
const fs = require('fs');

const app = express();
const router = express.Router();
const PORT = 8085;

app.use(cors());

let data = [];
let headers = [];

const path = '/app/assets/article_def_v_orig.csv'; //путь для docker
fs.createReadStream(path).on('error', (err) => {
    console.error('Error opening file:', err);
});

// Загрузка из базы данных
router.get('/load-db', (req, res) => {
    const db = new Database('./database/data.db');

    try {
        const rows = db.prepare('SELECT * FROM your_table').all();
        res.json(rows);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    } finally {
        db.close();
    }
});

// Загрузка из файла, который передается в теле запроса (путь к нему)
router.post('/load-file', (req, res) => {
    const filePath = req.body.filePath;

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({error: err.message});
        }

        const rows = data.split('\n').map(row =>
            row.split(',').map(cell => cell.trim())
        ).filter(row => row.length > 0);

        res.json(rows);
    });
});

//загрузка существующего начального файла
fs.createReadStream(path)
    .pipe(csv())
    .on('headers', (headerList) => {
        headers = headerList.slice(0, 5);
    })
    .on('data', (row) => {
        const filteredRow = {};
        headers.forEach((header, index) => {
            if (index < 5) {
                filteredRow[header] = row[header];
            }
        });
        data.push(filteredRow);
    })
    .on('end', () => {
        console.log('CSV file successfully processed');

        app.get('/api/data', (req, res) => {
            res.json(data);
        });

        app.listen(8085, () => {
            console.log(`Server is running on http://127.0.0.1:${PORT}`);
        });
    });