const lerp = require("lerp");
const FlightConstants = require('./data/flight-constants.js');
const Airports = require('./data/airports.json');
const axios = require("axios");
const cache = require('../cache')

// https://flight-distance.com/
// https://www.myclimate.org/fileadmin/user_upload/myclimate_-_home/01_Information/01_About_myclimate/09_Calculation_principles/Documents/myclimate-flight-calculator-documentation_EN.pdf [FL]

function emissionByDistance(distance, cabinClass) {
    let FC = {
        longHaul: Object.assign({}, FlightConstants.longHaul),
        shortHaul: Object.assign({}, FlightConstants.shortHaul)
    }

    FC.longHaul.CW = FC.longHaul.CW[cabinClass.toLowerCase()]
    FC.shortHaul.CW = FC.shortHaul.CW[cabinClass.toLowerCase()]

    let Constants = {}
    if (distance < 1500) {
        Constants = FC.shortHaul
    } else if (distance > 2500) {
        Constants = FC.longHaul
    } else {
        for (const key in FC.shortHaul) {
            Constants[key] = lerp(FC.shortHaul[key], FC.longHaul[key], (distance - 1500) / 1000)
        }
    }

    /*
    * https://www.myclimate.org/fileadmin/user_upload/myclimate_-_home/01_Information/01_About_myclimate/09_Calculation_principles/Documents/myclimate-flight-calculator-documentation_EN.pdf
    * Page No: 5 & 6
    * */
    const {S, PLF, DC, CF, CW, EF, P, M, AF, A, a, b, c} = Constants
    const x = distance

    const s1 = ((a * Math.pow(x, 2)) + (b * x) + c) / (S * PLF)
    return (s1 * CF) * CW * (EF * M + P) + (AF * x) + A
}

const findAirport = airport => {
    if (airport.length === 3) {
        return Airports.find(v => v.IATA_FAA === airport)
    } else {
        return Airports.find(v => v.ICAO === airport)
    }
}

async function getDistance(from, to) {
    from = from.toUpperCase()
    to = to.toUpperCase()

    const res = await cache.get(from + "::" + to).catch();
    if (res) {
        return res;
    }

    const _from = findAirport(from)
    const _to = findAirport(to)

    if (!_from || !_to) {
        return 0
    }

    const {data} = await axios.post('https://flight-distance.com/get_distance', {
        source_airport: _from.id,
        dest_airport: _to.id,
        aircraft_man: '',
        aircraft_type: ''
    })

    const distance = data.distance_html.match(/<span class='km'> ((\d+[.,]*)+) <\/span>/)[1].replaceAll(',', '')

    console.log('Distance: ' + distance)

    await cache.set(from + "::" + to, distance)

    return distance * 1
}

module.exports = {
    emissionByDistance,
    getDistance
}
