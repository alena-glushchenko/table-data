const request = require('supertest');
const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const router = express.Router();
app.use('/api', router);

const testDb = new Database(':memory:');

testDb.exec('CREATE TABLE your_table (id INT, name TEXT)');
const stmt = testDb.prepare('INSERT INTO your_table VALUES (?, ?)');
stmt.run(1, 'Test Item 1');
stmt.run(2, 'Test Item 2');

// Маршрут для загрузки из базы данных
router.get('/load-db', (req, res) => {
    try {
        const rows = testDb.prepare('SELECT * FROM your_table').all();
        res.json(rows);
    } catch (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: err.message });
    }
});

// Маршрут для загрузки из файла
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

// Тест для загрузки из базы данных
describe('GET /api/load-db', () => {
    it('should return an array of rows', async () => {
        const response = await request(app).get('/api/load-db');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(2);
        expect(response.body[0]).toEqual({ id: 1, name: 'Test Item 1' });
        expect(response.body[1]).toEqual({ id: 2, name: 'Test Item 2' });
    });
});

// Тест для загрузки файла
describe('POST /api/load-file', () => {
    it('should load data from a CSV file', async () => {
        const filePath = path.join(__dirname, '../client/src/assets/test.csv');

        const response = await request(app)
            .post('/api/load-file')
            .send({filePath});

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(3);
        expect(response.body[0]).toEqual(['id', 'name']);
        expect(response.body[1]).toEqual(['1', 'Test Item 1']);
        expect(response.body[2]).toEqual(['2', 'Test Item 2']);
    });
});

if (require.main === module) {
    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(`Test server running on http://127.0.0.1:${PORT}`);
    });
}


