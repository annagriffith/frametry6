// Fresh server with minimal group creation
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

console.log('Starting fresh server...');

const app = express();
const PORT = 3003;

// Middleware
app.use(cors());
app.use(express.json());

console.log('Middleware configured');

// Test endpoint
app.get('/api/test', (req, res) => {
    console.log('Test GET request received');
    res.json({ message: 'Server is working' });
});

// Load data function
function loadData() {
    try {
        const dataPath = path.join(__dirname, 'data.json');
        console.log('Loading data from:', dataPath);
        const raw = fs.readFileSync(dataPath, 'utf8');
        return JSON.parse(raw);
    } catch (error) {
        console.error('Error loading data:', error);
        return null;
    }
}

// Save data function
function saveData(data) {
    try {
        const dataPath = path.join(__dirname, 'data.json');
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving data:', error);
        return false;
    }
}

// Auth endpoint
app.post('/api/auth', (req, res) => {
    try {
        console.log('Auth request received');
        const { username, password } = req.body;
        const data = loadData();
        
        if (!data) {
            return res.status(500).json({ error: 'Could not load data' });
        }
        
        const user = data.users.find(u => u.username === username && u.password === password);
        if (user) {
            res.json({ valid: true, user });
        } else {
            res.json({ valid: false });
        }
    } catch (error) {
        console.error('Error in auth:', error);
        res.status(500).json({ error: 'Auth error' });
    }
});

// Groups GET endpoint
app.get('/api/groups', (req, res) => {
    try {
        console.log('Groups GET request received');
        const data = loadData();
        if (!data) {
            return res.status(500).json({ error: 'Could not load data' });
        }
        res.json(data.groups);
    } catch (error) {
        console.error('Error in groups GET:', error);
        res.status(500).json({ error: 'Groups GET error' });
    }
});

// Groups POST endpoint - Create group
app.post('/api/groups', (req, res) => {
    try {
        console.log('=== Groups POST request received ===');
        console.log('Request body:', req.body);
        
        const { requester, name, adminIds } = req.body;
        console.log('Parsed:', { requester, name, adminIds });
        
        // Load data
        const data = loadData();
        if (!data) {
            return res.status(500).json({ error: 'Could not load data' });
        }
        
        // Find user
        const user = data.users.find(u => u.username === requester);
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }
        
        if (user.role !== 'superAdmin') {
            return res.status(403).json({ error: 'Only super admin can create groups' });
        }
        
        if (!name || !name.trim()) {
            return res.status(400).json({ error: 'Group name is required' });
        }
        
        // Check if group exists
        if (data.groups.find(g => g.name.toLowerCase() === name.toLowerCase())) {
            return res.status(400).json({ error: 'Group name already exists' });
        }
        
        // Create group
        const newGroup = {
            id: 'g' + Math.random().toString(36).substring(2, 8),
            name: name.trim(),
            ownerId: requester,
            adminIds: [requester, ...(adminIds || [])],
            memberIds: [requester],
            channelIds: []
        };
        
        console.log('Creating group:', newGroup);
        
        // Add to data
        data.groups.push(newGroup);
        
        // Save data
        if (!saveData(data)) {
            return res.status(500).json({ error: 'Could not save data' });
        }
        
        console.log('Group created successfully');
        res.json({ success: true, group: newGroup });
        
    } catch (error) {
        console.error('Error in groups POST:', error);
        res.status(500).json({ error: 'Groups POST error: ' + error.message });
    }
});

// Error handling
app.use((error, req, res, next) => {
    console.error('Express error handler:', error);
    res.status(500).json({ error: 'Server error' });
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught exception:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('Unhandled rejection:', error);
});

// Start server
app.listen(PORT, () => {
    console.log(`Fresh server running on port ${PORT}`);
    console.log('Ready to accept requests');
});