## Architecture Overview

The project is structured as a Next.js frontend with a Node.js (Express) backend.
Although the requirement mentioned React, Next.js was chosen because it is built on top of React and provides additional capabilities like Server Components and Server-Side Rendering (SSR), which help improve performance, SEO, and maintainability.

---

### Frontend

* **Framework:**

Used Next.js (React-based) for routing, rendering, and component management. It allows clean integration with API routes and supports both server and client components.

*  **UI Library:**

Implemented shadcn/ui, built on Radix UI and Tailwind CSS, for consistent styling and accessibility.

* **Favorites:**

Used local storage to persist the favorite movies list across sessions without needing a backend database.

---

### Backend

* **Framework:**

Built with Node.js (Express) to expose REST APIs that interact with the TMDB API.

* **Caching:**

Added a simple in-memory cache for trending movies to avoid repetitive TMDB requests. The cache refreshes every 1 hour (configurable). In a production or high-traffic application, this would be replaced with a distributed cache like Amazon ElastiCache (Redis) or a similar caching layer for better scalability, reliability, and performance.

* **Environment Variables:**

Sensitive credentials like the TMDB API key are stored securely in .env files.


### Design Rationale and Alternatives

| Feature            | Choice                        | Reason                                         | Alternative                          |
|-------------------|-------------------------------|-----------------------------------------------|--------------------------------------|
| Frontend Framework | Next.js                        | React-based, adds SSR & Server Components for performance | React with Vite or CRA               |
| UI Library         | shadcn/ui                     | Tailwind-compatible, minimal, accessible components | Material UI or Chakra UI             |
| Caching            | In-memory cache (Redis in production) | Reduces API calls, improves speed             | Node-cache, Redis, or Memcached      |
| Favorites Storage  | Local Storage                 | Lightweight and simple client persistence     | Database (MongoDB/PostgreSQL)        |


### **Summary**

* **Performance:** SSR and caching improve rendering speed and API efficiency.
* **Scalability:** Architecture easily extends with Redis or cloud caching.
* **User Experience:** Clean UI, persistent favorites, and smooth navigation.
