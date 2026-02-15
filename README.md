# Bellcorp Event Management Application

This project is a full-stack Event Management platform built using the MERN stack.
It allows users to explore events, filter them efficiently, and manage their registrations through a clean dashboard interface.

The goal was to build an application that handles dynamic event discovery while maintaining good UX, backend validation, and proper authentication flow.

---

## Live Application

Frontend (Vercel): https://event-app-ten-alpha.vercel.app/events
Backend (Render): https://event-app-d2rd.onrender.com/

*(Links will be added before submission.)*

---

## What This Application Does

Users can:

* Browse a large collection of events
* Search events using flexible text queries
* Filter events by category, location, and date
* Navigate through paginated results
* Register for events
* Cancel registrations
* View upcoming and past events separately
* See summary insights about their registrations

All browsing filters are preserved in the URL so the state is maintained even after refresh or navigation.

---

## Tech Stack Used

**Frontend**

* React (with Hooks)
* React Router
* Axios
* Tailwind CSS
* Vite

**Backend**

* Node.js
* Express
* MongoDB (Atlas)
* Mongoose
* JWT Authentication
* bcrypt for password hashing

**Deployment**

* Vercel (Frontend)
* Render (Backend)
* GitHub for version control

---

## Key Features Implemented

### 🔍 Event Discovery

* Search bar powered by backend regex search
* Filter by:

  * Category
  * Location
  * Date
* Dropdown-based filters
* Pagination for large datasets
* Fully booked event handling
* Disabled “Registered” button logic
* Filter state synced with URL

---

### 👤 Dashboard

* Separate sections for:

  * Upcoming events
  * Past events
* Summary widgets:

  * Total registrations
  * Upcoming count
  * Past count
* Highlight for next upcoming event
* Cancel registration option
* Navigation to event details page

---

### 🔐 Authentication & Security

* User registration
* Login with JWT
* Password hashing
* Protected routes
* Token persistence
* Axios interceptor for automatic token attachment
* Auto logout on invalid/expired token

---

## Backend Highlights

* Regex-based search endpoint
* Filtering logic handled server-side
* Pagination handled at database level
* Duplicate registration prevention
* Capacity validation before registration
* Proper relational structure:

  * User ↔ Registration ↔ Event

---

## Project Structure

```
root
│
├── server
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middleware
│   └── server.js
│
├── client
│   ├── pages
│   ├── components
│   ├── context
│   ├── api
│   └── App.jsx
│
└── README.md
```

---

## How To Run Locally

### 1. Clone the repository

```
git clone <repo-link>
cd Event-app
```

---

### 2. Setup Backend

```
cd server
npm install
```

Create `.env` file inside `server` folder:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

Run backend:

```
npm start
```

---

### 3. Setup Frontend

```
cd client
npm install
```

Create `.env` file inside `client` folder:

```
VITE_API_URL=http://localhost:5000/api
```

Run frontend:

```
npm run dev
```

---

## Improvements Made Beyond Basic Requirements

While implementing the assignment requirements, a few additional enhancements were added:

* Dashboard summary widgets
* Highlighting next upcoming event
* URL-based state preservation
* Proper loading states
* Modal-based feedback instead of plain text
* Clean separation of upcoming and past history

---

## Things That Can Be Improved Further

If extended further, the following could be added:

* Admin panel for event creation
* Event images
* Forgot password flow
* Real-time seat updates
* Analytics for event organizers

---

## Final Notes

This project fulfills all the core functional requirements including search, filtering, pagination, authentication, dashboard categorization, and deployment.

It was designed with scalability and usability in mind while keeping the implementation clean and maintainable.

---
