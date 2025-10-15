const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(__dirname));

const hospitals = [
  { id: 'hospital1', name: 'hospital1' },
  { id: 'hospital2', name: 'hospital2' },
  { id: 'hospital3', name: 'hospital3' }
];

app.get('/hospitals', (req, res) => {
  res.json(hospitals);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
