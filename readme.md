# Trending Movies 🎬🍿

**Real-Time Movie Discovery and Trending Analysis Application**

A sleek, modern application for discovering trending movies, exploring popular films, and getting real-time movie data with a beautiful user interface.

---

## 🌟 Features

- 🎬 **Trending Movies** - Real-time trending movie listings
- 🔍 **Search** - Find movies by title or genre
- ⭐ **Ratings** - View IMDb and user ratings
- 📊 **Details** - In-depth movie information
- 🎯 **Filters** - Filter by genre, year, rating
- 💾 **Favorites** - Save favorite movies
- 📱 **Responsive** - Beautiful UI on all devices
- ⚡ **Fast** - Optimized performance

---

## 🛠️ Tech Stack

**Frontend:**
- React with TypeScript
- Modern CSS styling
- Responsive design
- API integration

**Services:**
- TMDB API (The Movie Database)
- Real-time data fetching

---

## 📊 Language Composition

```
TypeScript: 92.6%
CSS: 5.3%
Shell: 1.5%
JavaScript: 0.6%
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- TMDB API key (free from [themoviedb.org](https://www.themoviedb.org/settings/api))

### Installation

```bash
# Clone the repository
git clone https://github.com/saumaykilla/trendingMovies.git
cd trendingMovies

# Install dependencies
npm install
```

### Environment Setup

Create `.env.local`:

```env
REACT_APP_TMDB_API_KEY=your_api_key_here
REACT_APP_TMDB_BASE_URL=https://api.themoviedb.org/3
```

Get your API key:
1. Visit [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
2. Sign up for free
3. Generate an API key
4. Copy to `.env.local`

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
trendingMovies/
├── src/
│   ├── components/
│   │   ├── MovieCard.tsx      # Movie display card
│   │   ├── MovieList.tsx      # Movie grid
│   │   ├── SearchBar.tsx      # Search component
│   │   └── FilterPanel.tsx    # Filter controls
│   ├── pages/
│   │   ├── Trending.tsx       # Trending page
│   │   ├── Search.tsx         # Search results
│   │   └── Details.tsx        # Movie details
│   ├── hooks/
│   │   ├── useMovies.ts       # Movie fetching hook
│   │   └── useFavorites.ts    # Favorites management
│   ├── services/
│   │   └── tmdb.ts            # TMDB API service
│   ├── styles/
│   │   ├── globals.css        # Global styles
│   │   ├── components.css     # Component styles
│   │   └── pages.css          # Page styles
│   ├── types/
│   │   └── index.ts           # TypeScript types
│   └── App.tsx
├── public/                     # Static assets
├── package.json
└── README.md
```

---

## 🎯 Key Components

### Movie Card

Displays:
- Poster image
- Title
- Release date
- Rating
- Overview

### Search Bar

Features:
- Real-time search
- Auto-complete suggestions
- Keyboard shortcuts
- Recent searches

### Filter Panel

Options:
- Genre selection
- Year range
- Rating range
- Sorting options

### Movie Details Page

Shows:
- Full description
- Cast and crew
- Reviews and ratings
- Recommendations
- Trailer (if available)

---

## 📊 TMDB API Integration

Endpoints used:

```typescript
// Get trending movies
GET /trending/movie/week

// Search movies
GET /search/movie?query={query}

// Get movie details
GET /movie/{movieId}

// Get recommendations
GET /movie/{movieId}/recommendations

// Get top rated
GET /movie/top_rated

// Get popular
GET /movie/popular
```

---

## 🔄 Data Fetching

```typescript
// Example: Fetch trending movies
const fetchTrendingMovies = async () => {
  const response = await fetch(
    `${TMDB_BASE_URL}/trending/movie/week?api_key=${API_KEY}`
  );
  const data = await response.json();
  return data.results;
};
```

---

## 💾 Favorites Management

Store favorites locally:

```typescript
// Save favorite
localStorage.setItem('favorites', JSON.stringify(favorites));

// Load favorites
const saved = JSON.parse(localStorage.getItem('favorites') || '[]');
```

---

## 🎨 UI/UX Features

- Dark/Light theme toggle
- Smooth animations
- Responsive grid layout
- Loading states
- Error handling
- Empty states

---

## 📱 Responsive Design

- Mobile: Single column layout
- Tablet: 2 column layout
- Desktop: 3-4 column layout
- Touch-friendly on mobile

---

## ⚡ Performance Optimization

- Image lazy loading
- Request debouncing
- Caching strategy
- Code splitting
- Optimized re-renders

---

## 🚀 Build & Deployment

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

### Deploy to Vercel

```bash
vercel deploy --prod
```

---

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

---

## 📚 API Documentation

Full TMDB API docs: [https://developers.themoviedb.org/3](https://developers.themoviedb.org/3)

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/NewFeature`)
3. Commit changes (`git commit -m 'Add NewFeature'`)
4. Push to branch (`git push origin feature/NewFeature`)
5. Open Pull Request

---

## 📝 License

MIT License - see LICENSE file for details

---

## 📞 Support

For issues or questions:
- Open a GitHub issue
- Email: [saumay.killa@gmail.com](mailto:saumay.killa@gmail.com)

---

## 🔗 Links

- **GitHub**: [https://github.com/saumaykilla/trendingMovies](https://github.com/saumaykilla/trendingMovies)
- **TMDB API**: [https://www.themoviedb.org/](https://www.themoviedb.org/)

---

<div align="center">

**Discover Your Next Favorite Movie**

Made with ❤️ by Saumay Killa

[⬆ back to top](#trending-movies-)

</div>
