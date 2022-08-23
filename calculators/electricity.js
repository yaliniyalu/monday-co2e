const {ElectricityCountry} = require('./data')

const factorByCountry = (countryCode) => {
    const country = ElectricityCountry.find(e => e.country.code === countryCode);
    if (!country) {
        return 0;
    }

    let factor = country.electricityConversionFactor;
    if (!country.electricityConversionFactor) {
        factor = 0.5; // approximation
    }

    return factor;
}

module.exports = {
    factorByCountry
}
