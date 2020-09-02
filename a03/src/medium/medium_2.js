import mpg_data from "./data/mpg_data.js";
import {getStatistics} from "./medium_1.js";

/*
This section can be done by using the array prototype functions.
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
see under the methods section
*/


/**
 * This object contains data that has to do with every car in the `mpg_data` object.
 *
 *
 * @param {allCarStats.avgMpg} Average miles per gallon on the highway and in the city. keys `city` and `highway`
 *
 * @param {allCarStats.allYearStats} The result of calling `getStatistics` from medium_1.js on
 * the years the cars were made.
 *
 * @param {allCarStats.ratioHybrids} ratio of cars that are hybrids
 */
export const allCarStats = {
    avgMpg: {
        city: mpg_data.reduce((sum, car) => sum + car.city_mpg, 0) / mpg_data.length,
        highway: mpg_data.reduce((sum, car) => sum + car.highway_mpg, 0) / mpg_data.length
    },
    allYearStats: getStatistics(mpg_data.map(x => x.year)),
    ratioHybrids: mpg_data.filter(x => x.hybrid).length / mpg_data.length,
};

// console.log(allCarStats);

/**
 * HINT: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
 *
 * @param {moreStats.makerHybrids} Array of objects where keys are the `make` of the car and
 * a list of `hybrids` available (their `id` string). Don't show car makes with 0 hybrids. Sort by the number of hybrids
 * in descending order.
 *
 *[{
 *     "make": "Buick",
 *     "hybrids": [
 *       "2012 Buick Lacrosse Convenience Group",
 *       "2012 Buick Lacrosse Leather Group",
 *       "2012 Buick Lacrosse Premium I Group",
 *       "2012 Buick Lacrosse"
 *     ]
 *   },
 *{
 *     "make": "BMW",
 *     "hybrids": [
 *       "2011 BMW ActiveHybrid 750i Sedan",
 *       "2011 BMW ActiveHybrid 750Li Sedan"
 *     ]
 *}]
 *
 *
 *
 *
 * @param {moreStats.avgMpgByYearAndHybrid} Object where keys are years and each year
 * an object with keys for `hybrid` and `notHybrid`. The hybrid and notHybrid
 * should be an object with keys for `highway` and `city` average mpg.
 *
 * Only years in the data should be keys.
 *
 * {
 *     2020: {
 *         hybrid: {
 *             city: average city mpg,
 *             highway: average highway mpg
 *         },
 *         notHybrid: {
 *             city: average city mpg,
 *             highway: average highway mpg
 *         }
 *     },
 *     2021: {
 *         hybrid: {
 *             city: average city mpg,
 *             highway: average highway mpg
 *         },
 *         notHybrid: {
 *             city: average city mpg,
 *             highway: average highway mpg
 *         }
 *     },
 *
 * }
 */
export const moreStats = {
    makerHybrids: Object.entries(mpg_data.reduce((dict, car) => {
        if (car.hybrid) {
            if (!(car.make in dict)) {
                dict[car.make] = [];
            }
            dict[car.make].push(car.id);
        }
        return dict;
    }, {})).map(entry => ({
            "make": entry[0],
            "hybrids": entry[1]
    })),
    avgMpgByYearAndHybrid: getAvgMpgByYearAndHybrid()
};

console.log(moreStats);

function getAvgMpgByYearAndHybrid() {
    let stat = mpg_data.reduce((dict, car) => {
        let key = car.hybrid ? 'hybrid' : 'notHybrid'
        if (!(car.year in dict)) {
            dict[car.year] = {
                hybrid: [],
                notHybrid: []
            };
        }
        dict[car.year][key].push(car);
        return dict;
    }, {});
    // console.log(stat);

    for (let year in stat) {
        for (let type in stat[year]) {
            let mpgs = {
                city: stat[year][type].reduce((sum, car) => sum + car.city_mpg, 0) / stat[year][type].length, 
                highway: stat[year][type].reduce((sum, car) => sum + car.city_mpg, 0) / stat[year][type].length
            };
            stat[year][type] = mpgs;
        }
    }
    // console.log(stat);
    return stat;
}
