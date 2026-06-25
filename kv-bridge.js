const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const store = {};

app.post('/set/:key', (req, res) => {
    const { key } = req.params;
    const { value } = req.body;
    store[key] = value;
    console.log(`KV Set: ${key} = ${value}`);
    res.json({ success: true });
});

app.get('/get/:key', (req, res) => {
    const { key } = req.params;
    const value = store[key];
    console.log(`KV Get: ${key} = ${value}`);
    res.json({ value });
});

app.listen(port, () => {
    console.log(`KV Bridge listening at http://localhost:${port}`);
});
