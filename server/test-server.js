// Simple test to check if the server code is working
const express = require('express');
const app = express();
const PORT = 3002;

app.use(express.json());

// Simple test endpoint
app.post('/api/test', (req, res) => {
	console.log('Test request received:', req.body);
	res.json({ success: true, received: req.body });
});

app.listen(PORT, () => {
	console.log(`Test server running on port ${PORT}`);
});