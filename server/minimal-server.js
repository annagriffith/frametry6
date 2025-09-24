// Minimal test server to debug group creation issue
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

console.log('Starting minimal test server...');

// Simple test endpoint
app.post('/api/test', (req, res) => {
    console.log('Test POST received:', req.body);
    res.json({ success: true, received: req.body });
});

// Minimal group creation endpoint
app.post('/api/groups', (req, res) => {
    console.log('Group creation POST received:', req.body);
    try {
        const { requester, name, adminIds } = req.body;
        console.log('Parsed fields:', { requester, name, adminIds });
        
        if (!requester) {
            return res.status(400).json({ error: 'Requester is required.' });
        }
        
        if (!name) {
            return res.status(400).json({ error: 'Name is required.' });
        }
        
        console.log('Validation passed, creating group...');
        
        const newGroup = {
            id: 'g' + Math.random().toString(36).substring(2, 8),
            name: name.trim(),
            ownerId: requester,
            adminIds: [requester, ...(adminIds || [])],
            memberIds: [requester],
            channelIds: []
        };
        
        console.log('Group created successfully:', newGroup);
        res.json({ success: true, group: newGroup });
    } catch (error) {
        console.error('Error in group creation:', error);
        res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Minimal test server running on port ${PORT}`);
});