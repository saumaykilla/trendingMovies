import { Request, Response } from "express";

export const movieByIdService = async(req: Request, res: Response) => {
    const { id } = req.params;
    const { api_key, TMDB_BASE_URL } = process.env;
    if (!id){
        return res.status(400).json({ message: 'Movie ID is required' });
    }
    if (!api_key){
        return res.status(500).json({ message: 'API key is required' });
    }
    try {
        const url = `${TMDB_BASE_URL}/movie/${id}`;
        const options = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${api_key}`
            }
        };
        const response = await fetch(url, options);
        if (!response.ok){
            return res.status(500).json({ message: 'Failed to fetch movie' });
        }
        const data = await response.json();
        if(!data){
            return res.status(502).json({ message: 'Invalid data format from TMDB' });
        }
        return res.json(data);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch movie' });
    }
}