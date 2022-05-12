function convertTimeStamp(timestamp) {
  var datetime = new Date(timestamp);
  //   datetime.setMinutes(datetime.getMinutes() + datetime.getTimezoneOffset());
  const year = datetime.getFullYear().toString();
  const month = (datetime.getMonth() + 1).toString();
  const mothStr = month.length === 1 ? '0' + month : month;
  const day = datetime.getDate().toString();
  const dayStr = day.length === 1 ? '0' + day : day;
  const hours = datetime.getHours().toString();
  const hoursStr = hours.length === 1 ? '0' + hours : hours;
  const minutes = datetime.getMinutes().toString();
  const minutesStr = minutes.length === 1 ? '0' + minutes : minutes;
  return (
    year + ':' + mothStr + ':' + dayStr + ' in ' + hoursStr + ':' + minutesStr
  );
}

export {convertTimeStamp};
