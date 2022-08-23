// https://www.carbonindependent.org/files/conversion-factors.pdf
// https://people.exeter.ac.uk/TWDavies/energy_conversion/Calculation%20of%20CO2%20emissions%20from%20fuels.htm
// https://www.carbonindependent.org/files/actonco2-calc-methodology.pdf

module.exports = [
    /* Petrol */
    { name: 'Petrol car (upto 1.4L)', factor: 0.1831 },
    { name: 'Petrol car (1.4L - 2.0L)', factor: 0.2162 },
    { name: 'Petrol car (above 2.0L)', factor: 0.2964 },
    { name: 'Petrol car', factor: 0.2095 },

    /* Diesel */
    { name: 'Diesel car (upto 1.7L)', factor: 0.1507 },
    { name: 'Diesel car (1.7L - 2.0L)', factor: 0.1881 },
    { name: 'Diesel car (above 2.0L)', factor: 0.2635 },
    { name: 'Diesel car', factor: 0.1987 },

    /* Petrol Hybrid */
    { name: 'Petrol hybrid car (medium)', factor: 0.1262 },
    { name: 'Petrol hybrid car (large)', factor: 0.2240 },

    /* Average Car */
    { name: 'Car', factor: 0.2075 },

    /* Motorcycles */
    { name: 'Motorbike (up to 125cc)', factor: 0.0729 },
    { name: 'Motorbike (125cc to 500cc)', factor: 0.0939 },
    { name: 'Motorbike (over 500cc)', factor: 0.1296 },
    { name: 'Motorbike', factor: 0.1067 },

    /* Bus */
    { name: 'Bus', factor: 0.0891, unit: 'pkm' },

    /* Rail */
    { name: 'National rail', factor: 0.0602, unit: 'pkm' },
    { name: 'Light rail', factor: 0.0650, unit: 'pkm' },
    { name: 'Underground rail', factor: 0.0526, unit: 'pkm' },

    { name: 'Articulated lorry, diesel engine', factor: 2.68 },
]
