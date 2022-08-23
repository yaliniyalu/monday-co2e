// https://www.myclimate.org/fileadmin/user_upload/myclimate_-_home/01_Information/01_About_myclimate/09_Calculation_principles/Documents/myclimate-flight-calculator-documentation_EN.pdf

module.exports = {
    shortHaul: {
        S: 153.51,
        PLF: 0.82,
        DC: 95,
        CF: 0.93,
        CW: {
            economy: 0.96,
            business: 1.26,
            first: 2.40,
        },
        EF: 3.15,
        P: 0.54,
        M: 2,
        AF: 0.00038,
        A: 11.68,
        a: 0.0000,
        b: 2.714,
        c: 1166.52
    },
    longHaul: {
        S: 280.21,
        PLF: 0.82,
        DC: 95,
        CF: 0.74,
        CW: {
            economy: 0.80,
            business: 1.54,
            first: 2.40,
        },
        EF: 3.15,
        P: 0.54,
        M: 2,
        AF: 0.00038,
        A: 11.68,
        a: 0.0001,
        b: 7.104,
        c: 5044.93
    }
}
