// Basic Express backend for Frametry6 chat app
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Load data from data.json
function loadData() {
	try {
		const dataPath = path.join(__dirname, 'data.json');
		console.log('Loading data from:', dataPath);
		const raw = fs.readFileSync(dataPath, 'utf8');
		const data = JSON.parse(raw);
		console.log('Data loaded successfully');
		return data;
	} catch (error) {
		console.error('Error loading data:', error);
		throw error;
	}
}

// Save data to data.json
function saveData(data) {
	try {
		const dataPath = path.join(__dirname, 'data.json');
		console.log('Saving data to:', dataPath);
		fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
		console.log('Data saved successfully');
	} catch (error) {
		console.error('Error saving data:', error);
		throw error;
	}
}

// Auth endpoint
app.post('/api/auth', (req, res) => {
	try {
		console.log('Auth request received:', req.body);
		const { username, password } = req.body;
		const data = loadData();
		const user = data.users.find(u => u.username === username && u.password === password);
		if (user) {
			console.log('User authenticated successfully:', username);
			res.json({ valid: true, user });
		} else {
			console.log('Authentication failed for:', username);
			res.json({ valid: false });
		}
	} catch (error) {
		console.error('Error in auth endpoint:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// Users endpoint

// Get all users
app.get('/api/users', (req, res) => {
	const data = loadData();
	res.json(data.users);
});

// Add a new user (super admin only)
app.post('/api/users', (req, res) => {
	const { requester, username, password, email, role } = req.body;
	const data = loadData();
	const superAdmin = data.users.find(u => u.username === requester && u.role === 'superAdmin');
	if (!superAdmin) {
		return res.status(403).json({ error: 'Only super admin can add users.' });
	}
	if (data.users.find(u => u.username === username)) {
		return res.status(400).json({ error: 'Username already exists.' });
	}
	const newUser = { username, password, email, role };
	data.users.push(newUser);

	// Add new user to 'General' group (by id for robustness)
	let generalGroup = data.groups.find(g => g.name === 'General' || g.id === 'g1');
	if (!generalGroup) {
		generalGroup = {
			id: 'g1',
			name: 'General',
			ownerId: 'super',
			adminIds: ['super'],
			memberIds: [],
			channelIds: []
		};
		data.groups.push(generalGroup);
	}
	if (!generalGroup.memberIds.includes(username)) {
		generalGroup.memberIds.push(username);
	}

	saveData(data);
	res.json({ success: true, user: newUser });
});

// Update user role (super admin only)
app.put('/api/users/:username', (req, res) => {
	try {
		console.log('User update request received:', req.params.username, req.body);
		const { requester, role } = req.body;
		const username = req.params.username;
		const data = loadData();
		
		const superAdmin = data.users.find(u => u.username === requester && u.role === 'superAdmin');
		if (!superAdmin) {
			return res.status(403).json({ error: 'Only super admin can update user roles.' });
		}
		
		if (username === requester) {
			return res.status(400).json({ error: 'Super admin cannot change own role.' });
		}
		
		const userIndex = data.users.findIndex(u => u.username === username);
		if (userIndex === -1) {
			return res.status(404).json({ error: 'User not found.' });
		}
		
		const validRoles = ['user', 'groupAdmin', 'superAdmin'];
		if (!validRoles.includes(role)) {
			return res.status(400).json({ error: 'Invalid role.' });
		}
		
		// Update user role
		data.users[userIndex].role = role;
		saveData(data);
		
		console.log('User role updated successfully:', username, 'to', role);
		res.json({ success: true, user: data.users[userIndex] });
	} catch (error) {
		console.error('Error updating user role:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// Delete a user (super admin only)
app.delete('/api/users/:username', (req, res) => {
	const { requester } = req.body;
	const data = loadData();
	const superAdmin = data.users.find(u => u.username === requester && u.role === 'superAdmin');
	if (!superAdmin) {
		return res.status(403).json({ error: 'Only super admin can delete users.' });
	}
	const username = req.params.username;
	if (username === requester) {
		return res.status(400).json({ error: 'Super admin cannot delete self.' });
	}
	const userIndex = data.users.findIndex(u => u.username === username);
	if (userIndex === -1) {
		return res.status(404).json({ error: 'User not found.' });
	}
	data.users.splice(userIndex, 1);
	saveData(data);
	res.json({ success: true });
});


// Get all groups
app.get('/api/groups', (req, res) => {
	const data = loadData();
	res.json(data.groups);
});

// Create a new group (super admin only)
app.post('/api/groups', (req, res) => {
	try {
		console.log('=== GROUP CREATION REQUEST START ===');
		console.log('Request body:', JSON.stringify(req.body, null, 2));
		console.log('Request headers:', req.headers);
		
		const { requester, name, adminIds } = req.body;
		console.log('Extracted fields:', { requester, name, adminIds });
		
		console.log('Loading data...');
		const data = loadData();
		console.log('Data loaded, finding user...');
		const user = data.users.find(u => u.username === requester);
		console.log('Found user:', user);
		
		if (!user || user.role !== 'superAdmin') {
			return res.status(403).json({ error: 'Only super admin can create groups.' });
		}
		
		if (!name || !name.trim()) {
			return res.status(400).json({ error: 'Group name is required.' });
		}
		
		// Check if group name already exists
		if (data.groups.find(g => g.name.toLowerCase() === name.toLowerCase())) {
			return res.status(400).json({ error: 'Group name already exists.' });
		}
		
		// Generate new group ID
		const newId = 'g' + Math.random().toString(36).substring(2, 8);
		
		// Create new group
		const newGroup = {
			id: newId,
			name: name.trim(),
			ownerId: requester,
			adminIds: [requester, ...(adminIds || [])],
			memberIds: [requester],
			channelIds: []
		};
		
		data.groups.push(newGroup);
		saveData(data);
		
		console.log('Group created successfully:', newGroup);
		res.json({ success: true, group: newGroup });
	} catch (error) {
		console.error('Error creating group:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// Delete a group (super admin only)
app.delete('/api/groups/:groupId', (req, res) => {
	try {
		console.log('Group deletion request received:', req.params.groupId, req.body);
		const { requester } = req.body;
		const groupId = req.params.groupId;
		const data = loadData();
		const user = data.users.find(u => u.username === requester);
		
		if (!user || user.role !== 'superAdmin') {
			return res.status(403).json({ error: 'Only super admin can delete groups.' });
		}
		
		const groupIndex = data.groups.findIndex(g => g.id === groupId);
		if (groupIndex === -1) {
			return res.status(404).json({ error: 'Group not found.' });
		}
		
		const group = data.groups[groupIndex];
		
		// Don't allow deleting the General group
		if (group.name === 'General' || group.id === 'g1') {
			return res.status(400).json({ error: 'Cannot delete the General group.' });
		}
		
		// Remove all channels associated with this group
		data.channels = data.channels.filter(c => c.groupId !== groupId);
		
		// Remove the group
		data.groups.splice(groupIndex, 1);
		
		saveData(data);
		
		console.log('Group deleted successfully:', groupId);
		res.json({ success: true });
	} catch (error) {
		console.error('Error deleting group:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// Get all channels
app.get('/api/channels', (req, res) => {
	const data = loadData();
	res.json(data.channels);
});

// Create a new channel (group/super admin only)
app.post('/api/channels', (req, res) => {
	const { requester, groupId, name } = req.body;
	const data = loadData();
	const user = data.users.find(u => u.username === requester);
	const group = data.groups.find(g => g.id === groupId);
	if (!user || !group) {
		return res.status(400).json({ error: 'User or group not found.' });
	}
	if (!(user.role === 'superAdmin' || (user.role === 'groupAdmin' && group.adminIds.includes(user.username)))) {
		return res.status(403).json({ error: 'Only group/super admin can create channels.' });
	}
	if (data.channels.find(c => c.groupId === groupId && c.name === name)) {
		return res.status(400).json({ error: 'Channel name already exists.' });
	}
	const newId = 'c' + Math.random().toString(36).substring(2, 8);
	const newChannel = {
		id: newId,
		groupId,
		name,
		memberIds: group.memberIds
	};
	data.channels.push(newChannel);
	group.channelIds.push(newId);
	saveData(data);
	res.json({ success: true, channel: newChannel });
});

// Error handling middleware
app.use((error, req, res, next) => {
	console.error('Unhandled error:', error);
	res.status(500).json({ error: 'Internal server error' });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
	console.error('Uncaught Exception:', error);
	process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
	console.error('Unhandled Rejection at:', promise, 'reason:', reason);
	process.exit(1);
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
	console.log(`Data path: ${path.join(__dirname, 'data.json')}`);
});
