console.log('Starting ultra-minimal server...');

const express = require('express');
const app = express();

console.log('Express app created');

app.get('/', (req, res) => {
    console.log('Root request received');
    res.send('Hello World');
});

console.log('Route defined');

const server = app.listen(3004, () => {
    console.log('Ultra-minimal server running on port 3004');
});

console.log('Server listen called');

server.on('error', (err) => {
    console.error('Server error:', err);
});

console.log('Server started successfully');