const fs = require("fs");
const path = require("path");
const axios = require("axios");

// https://flight-distance.com/

(async () => {
    const { data } = await axios.get('https://flight-distance.com/get_airports')
    const airports = data.data;
    fs.writeFileSync(path.resolve(__dirname, '../airports.json'), JSON.stringify(airports));

    console.log(airports.filter(v => v.Name.length <= 4));
})();
