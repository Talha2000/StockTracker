
// Finnhub requires us to pass in unix timestamp
// date.getTime() returns milliscends
// finnhub uses seconds
// we convert from milliseconds to seconds

export const convertDateToUnixTimeStamp = (date) => {
   return Math.floor(date.getTime() / 1000)
}

// opposite from above
export const convertUnixTimeStampToDate = (unixTimeStamp) => {
    const ms = unixTimeStamp * 1000;
    return new Date(ms).toLocaleDateString();
    //helping formate some data to format to user
}

// have a start date
// depending on what we pass in
// add it to the date
// help create start date and end date to pass into FinnHub api
export const createDate = (date, days, weeks, months, years) => {
    let newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days + 7 * weeks);
    newDate.setMonth(newDate.getMonth() + months);
    newDate.setFullYear(newDate.getFullYear() + years);

    return newDate;
}