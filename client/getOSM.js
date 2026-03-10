import fs from 'fs';

async function getOSM() {
    try {
        const response = await fetch('https://overpass-api.de/api/interpreter', {
            method: 'POST',
            body: '[out:json];(node(12.835,80.145,12.848,80.165);way(12.835,80.145,12.848,80.165);relation(12.835,80.145,12.848,80.165););out center;'
        });
        const data = await response.json();
        const buildings = data.elements.filter(e => e.tags && e.tags.name).map(e => ({
            name: e.tags.name,
            lat: e.lat || e.center?.lat,
            lon: e.lon || e.center?.lon
        }));
        fs.writeFileSync('osm_results.json', JSON.stringify(buildings, null, 2));
        console.log(`Found ${buildings.length} locations. Check osm_results.json`);
    } catch (err) {
        console.error(err);
    }
}

getOSM();
