const fs = require("fs").promises;
const path = require("path");

async function loadSightings() {
  try {
    const filePath = path.join(__dirname, "..", "data", "sightings.json");

    const dataString = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(dataString);
    return data.sightings;
  } catch (error) {
    console.error("Error loading sightings:", error.message);

    throw new Error(`Failed to load sightings data: ${error.message}`);
  }
}

module.exports = { loadSightings };
