
# Frametry6 Chat App

A modern, role-based group chat application built with Angular and Node.js. Supports Super Admin, Group Admin, and User roles, with per-channel messaging, group/channel management, and a vibrant pink UI theme.

---

## Features

- **Role-based login:** Super Admin, Group Admin, User
- **Profile page:** View your groups and channels
- **Group Admin dashboard:** Create/manage groups, channels, and members
- **Super Admin dashboard:** Create/delete users
- **Chat:** Per-channel messaging
- **Bootstrap & custom pink theme:** Modern, cute, and girly UI
- **Error/success feedback:** Clear UI feedback for admin actions
- **Guards:** AuthGuard and RoleGuard for secure routing
- **LocalStorage:** Frontend data persistence
- **REST API:** Node.js/Express backend for users, groups, channels
- **Human-readable code comments**

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm
- Angular CLI (v16+ recommended)
- Git

### Installation

1. **Clone the repository:**

 ```sh
 git clone https://github.com/annagriffith/frametry6.git
 cd frametry6
 ```

2. **Install dependencies:**

 ```sh
 cd chat
   npm install
 cd ../server
 npm install
 ```

### Running the App

1. **Start the backend server:**

 ```sh
 cd server
 node server.js
 ```

1. **Start the Angular frontend:**

 ```sh
 cd ../chat
 npm start
 ```

3. **Open your browser:**

- Frontend: [http://localhost:4200](http://localhost:4200)
- Backend: [http://localhost:3000](http://localhost:3000)

---

## Test Credentials

- Super Admin — **super / 123**
- Group Admin — **group / 123**
- User — **user / 123**

---

## Project Structure


frametry6/
├── chat/                # Angular frontend
│   ├── src/app/app/     # Main app components
│   ├── src/app/models/  # Data models (User, Group, Channel, Message)
│   ├── src/app/services # LocalStorage service
│   ├── src/app/guards/  # AuthGuard, RoleGuard
│   ├── src/styles/      # Global and theme CSS
│   └── ...
├── server/              # Node.js/Express backend
│   ├── server.js        # Main server file
│   ├── data.json        # Seeded users, groups, channels
│   └── ...
└── README.md            # Project documentation

---

## Roles & Permissions

- **Super Admin:**
  - Create/delete users
  - Access all groups/channels
  - Create channels in any group
- **Group Admin:**
  - Create/manage groups
  - Create/manage channels
  - Add/remove group members
- **User:**
  - View groups/channels
  - Chat in channels

---

## Rule Clarity

- Users **cannot see a channel** unless they are explicitly added to that channel’s `memberUsernames`.

---

## Key Components

- **Home:** Welcome page, navigation
- **Login:** Role-based authentication
- **Profile:** User info, groups, channels, channel creation (admin only)
- **Group Admin:** Group/channel/member management
- **Admin:** Super admin user management
- **Chat:** Per-channel messaging

---

## Angular Architecture

- **Components:** Home, Login, Profile, Chat, GroupAdmin, Admin
- **Services:** LocalStorageService (messages per channel; seeding helper)
- **Guards:** AuthGuard (requires login), RoleGuard (route data.roles)
- **Models:** User, Group, Channel, Message
- **Routes:** `/`, `/login`, `/profile`, `/chat`, `/group-admin`, `/admin`
- **Visibility:** Navbar shows Admin/Group Admin links only for permitted roles.

---

## Data Structures (Phase 1)

### User

```json
{ "username":"group","email":"group@chat.com","role":"groupAdmin" }
```

### Group

```json
{
  "id":"g1","name":"General","ownerUsername":"group",
  "adminUsernames":["group"], "memberUsernames":["super","group","user"], "channelIds":["c1","c2"]
}
```

### Channel

```json
{ "id":"c1","groupId":"g1","name":"General Chat","memberUsernames":["super","group","user"] }
```

### Message (localStorage only)

```json
{ "id":"m1","channelId":"c1","sender":"group","text":"hi","timestamp":1694052882000 }
```

---

## REST API (Phase 1)

### POST /api/auth

Request: `{ "username": "super", "password": "123" }`

Response: `{ "valid": true, "user": { "username":"super","email":"super@chat.com","role":"superAdmin" } }` or `{ "valid": false }`

### GET /api/users

Response: `[{ "username":"...", "email":"...", "role":"..." }, ...]`

### POST /api/users

Request: `{ "username":"new", "email":"new@chat.com", "role":"user", "password":"123" }`

Rules: **username must be unique**

Response: `{ "ok": true }`

### DELETE /api/users/:username

Response: `{ "ok": true }`

### GET /api/groups

Response: `[Group]` as defined above

### POST /api/groups

Request: `{ "id":"g-123","name":"New Group","ownerUsername":"group","adminUsernames":["group"] }`

Response: `{ "ok": true }`

### PATCH /api/groups/:id/members

Request: `{ "add":"username" }` **or** `{ "remove":"username" }`

Response: `{ "ok": true, "group": { ... } }`

### GET /api/channels?groupId=g1

Response: `[Channel]`

### POST /api/channels

Request: `{ "id":"c-123","groupId":"g1","name":"General Chat" }`

Response: `{ "ok": true }`

### DELETE /api/channels/:id

Response: `{ "ok": true }`

**Rule:** A user **cannot see a channel** unless they are explicitly in that channel’s `memberUsernames`.

---

## JSON Serialisation

- Server state is persisted to **server/data.json** (users, groups, channels).
- On **server start**, data is loaded from `data.json`.
- After **every create/update/delete**, the server writes back to `data.json`.

---

## Theming & UI

- Uses Bootstrap for layout and components
- Custom pink theme via `src/styles/pink-theme.css`
- Responsive and modern design

---

## Development Notes

- Standalone Angular components (v16+)
- Guards for route protection
- LocalStorage for frontend state
- REST API for backend data
- Human-readable comments throughout codebase

---

## Git & Submission

- Frequent, descriptive commits; feature branches (e.g., `feat/login`, `feat/group-admin`).
- `.gitignore` excludes `node_modules/`.
- **Invite tutor** to the private GitHub repo.
- **Submit a Word copy of this README** on Canvas + the repo link.

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push to your branch and open a pull request

---

## License

MIT

---

## Author

Anna Griffith

---

## Contact & Support

- GitHub Issues: [https://github.com/annagriffith/frametry6/issues](https://github.com/annagriffith/frametry6/issues)
- For questions, open an issue or contact the author via GitHub
