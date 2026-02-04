/********************************************************************************
* WEB322 - Assignment 01
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Gurpreet Singh    Student ID: 143124246    Date: 03-02-2026
*
********************************************************************************/
const express = require('express');
const path = require('path');
const { loadSightings } = require('./utils/dataLoader');
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/index.html'));
});

// GET /api/sightings - Return ALL sighting records
app.get('/api/sightings', async (req, res) => {
    const sightings = await loadSightings();
    res.json(sightings);
});

// GET /api/sightings/verified - Return only verified sightings
app.get('/api/sightings/verified', async (req, res) => {
    const sightings = await loadSightings();
    const verifiedSightings = sightings.filter((sighting) => sighting.verified === true);
    res.json(verifiedSightings);
});

// GET /api/sightings/species-list - Return unique species names
app.get('/api/sightings/species-list', async (req, res) => {
    const sightings = await loadSightings();
    const speciesNames = sightings.map((sighting) => sighting.species);
    const uniqueSpecies = [...new Set(speciesNames)];
    res.json(uniqueSpecies);
});

// GET /api/sightings/habitat/forest - Return all forest habitat sightings
app.get('/api/sightings/habitat/forest', async (req, res) => {
    const sightings = await loadSightings();
    const forestSightings = sightings.filter((sighting) => sighting.habitat === 'forest');
    res.json({
        habitat: 'forest',
        sightings: forestSightings,
        count: forestSightings.length
    });
});

// GET /api/sightings/search/eagle - Find first sighting containing "eagle"
app.get('/api/sightings/search/eagle', async (req, res) => {
    const sightings = await loadSightings();
    const eagleSighting = sightings.find((sighting) =>
        sighting.species.toLowerCase().includes('eagle')
    );
    res.json(eagleSighting);
});

// GET /api/sightings/find-index/moose - Find index of "Moose" sighting
app.get('/api/sightings/find-index/moose', async (req, res) => {
    const sightings = await loadSightings();
    const mooseIndex = sightings.findIndex((sighting) => sighting.species === 'Moose');
    res.json({
        index: mooseIndex,
        sighting: mooseIndex !== -1 ? sightings[mooseIndex] : null
    });
});

// GET /api/sightings/recent - Return 3 most recent sightings
app.get('/api/sightings/recent', async (req, res) => {
    const sightings = await loadSightings();
    const sortedSightings = [...sightings].sort((a, b) => new Date(b.date) - new Date(a.date));
    const recentSightings = sortedSightings.slice(0, 3).map((sighting) => ({
        species: sighting.species,
        date: sighting.date,
        location: sighting.location,
        observer: sighting.observer
    }));
    res.json(recentSightings);
});

app.listen(HTTP_PORT, () => console.log(`listening to port ${HTTP_PORT}`));