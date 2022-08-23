// https://en.wikipedia.org/wiki/Life-cycle_greenhouse_gas_emissions_of_energy_sources

const electricityFactors = [
    { name: 'Biomass', co2: 230 },
    { name: 'Coal', co2: 820 },
    { name: 'Solar Power', co2: 27 },
    { name: 'Gas', co2: 490 },
    { name: 'Geothermal', co2: 38 },
    { name: 'Hydropower', co2: 24 },
    { name: 'Nuclear', co2: 12 },
    { name: 'Ocean (Tidal and Wave)', co2: 17 },
    { name: 'Solar PV - Rooftop', co2: 41 },
    { name: 'Solar PV - Utility scale', co2: 48 },
    { name: 'Wind Offshore', co2: 12 },
    { name: 'Wind Onshore', co2: 11 },
].map(v => {
    return {
        name: v.name,
        factor: v.co2 / 1000
    }
})

module.exports = electricityFactors;
