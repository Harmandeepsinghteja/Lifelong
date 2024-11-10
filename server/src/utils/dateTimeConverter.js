
const getCurrentDateTimeAsString = () => {
  var dateTime = new Date();
  var utcOffset = "+00:00";
  dateTime =
    dateTime.getUTCFullYear() +
    "-" +
    ("00" + (dateTime.getUTCMonth() + 1)).slice(-2) +
    "-" +
    ("00" + dateTime.getUTCDate()).slice(-2) +
    " " +
    ("00" + dateTime.getUTCHours()).slice(-2) +
    ":" +
    ("00" + dateTime.getUTCMinutes()).slice(-2) +
    ":" +
    ("00" + dateTime.getUTCSeconds()).slice(-2) +
    utcOffset;
  return dateTime;
};

export default getCurrentDateTimeAsString
