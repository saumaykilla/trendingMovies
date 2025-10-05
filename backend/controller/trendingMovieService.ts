import { getCache, setCache } from "../cache";
import { Request, Response } from "express";

 export const trendingMovieService = async (req: Request, res: Response) => {
    const { time_window } = req.params;
    const { page } = req.query;
    const { api_key, TMDB_BASE_URL } = process.env;
  
    if (!time_window || !["day", "week"].includes(time_window)) {
      return res.status(400).json({
        message: 'Query param "type" is required and must be "day" or "week"',
      });
    }
    // validate page
    const pageNumber = parseInt(page as string, 10);
    if (Number.isNaN(pageNumber) || pageNumber < 1) {
      return res.status(400).json({
        message: 'Query param "page" must be a positive integer',
      });
    }

    if (!api_key) {
        return res.status(500).json({ message: "Missing TMDB API key" });
      }
    const cached = getCache(time_window as "day" | "week", pageNumber);
    if (cached) {
      return res.json(cached );
    }
  
    try {
      const url = `${TMDB_BASE_URL}/trending/movie/${time_window}?page=${pageNumber}`;
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${api_key}`
        }
      };

      const response = await fetch(url, options);
      if (!response.ok) {
        const err = await response.json();
        return res.status(response.status).json({
            message: err.status_message || "TMDB API error",
        });
      }
      const data = await response.json();

      if (!data || !Array.isArray(data.results)) {
        return res.status(502).json({ message: "Invalid data format from TMDB" });
      }
      setCache(time_window as "day" | "week", pageNumber, data);
      return res.json(data );
    } catch (error) {
      return res.status(500).json({ message: 'Failed to fetch trending movies' });
    }
  }