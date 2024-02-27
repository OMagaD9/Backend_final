const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const comics = require('../models/comics');
require('dotenv').config();
const router = express.Router();

router.get('/', (req, res) => {
  res.render('comics', { comicsData: [] }); // pass an empty comics Data
});

router.post('/', async (req, res) => {
  const searchQuery = req.body.search;
  try {
    const response = await axios.get(`https://comicvine.gamespot.com/api/issues/?api_key=${process.env.COMICS_API_KEY}&filter=name:${searchQuery}&format=json`);
    const comicsData = response.data.results; 

    const decodedToken = jwt.decode(req.cookies.token);
    const userId = decodedToken.userId; 
    const search = req.body.search;

    userComics = new comics({ userId, search,comicsList: [] });
    comicsData.forEach(comics => {
      userComics.comicsList.push({
        cover: comics.image.original_url,
        title: comics.name,
        issue_number: comics.issue_number,
        cover_date: comics.cover_date,
        site_detail_url: comics.site_detail_url,
      });
    });

    // Save the updated comics document
    await userComics.save();

    // Render the comics page with the updated comicsData
    res.render('comics', { comicsData });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = router;
