const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const manga = require('../models/manga'); // Подключаем модель аниме
const router = express.Router();

router.get('/', (req, res) => {
  res.render('manga', { mangaData: [] }); // pass an empty manga Data
});

router.post('/', async (req, res) => {
  const searchQuery = req.body.search;
  try {
    const response = await axios.get(`https://manga-api.vercel.app/mangareader/search/${searchQuery}`);
    const mangaData = response.data; 

    const decodedToken = jwt.decode(req.cookies.token);
    const userId = decodedToken.userId; 
    const search = req.body.search;

    userManga = new manga({ userId, search,mangaList: [] });
    mangaData.forEach(manga => {
      userManga.mangaList.push({
        cover: manga.cover,
        title: manga.title,
        chapters: manga.chapters,
        genres: manga.genres.map(genre => genre.name),
        provider_url: manga.provider_url,
      });
    });

    // Save the updated manga document
    await userManga.save();

    // Render the manga page with the updated mangaData
    res.render('manga', { mangaData });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = router;
