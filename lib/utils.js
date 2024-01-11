export function formatDate(utcTimeStamp) {
  const date = new Date(utcTimeStamp + 'Z');
  const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  const formattedDate = date.toLocaleDateString('en-US', dateOptions);

  const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
  const formattedTime = date.toLocaleTimeString('en-US', timeOptions);

  return `${formattedDate} at ${formattedTime}`;
}

export function formatFileSize(bytes) {
  if (bytes < 1024) {
    return bytes + ' Bytes';
  } else if (bytes < 1048576) {
    return (bytes / 1024).toFixed(2) + ' KB';
  } else if (bytes < 1073741824) {
    return (bytes / 1048576).toFixed(2) + ' MB';
  } else if (bytes < 1099511627776) {
    return (bytes / 1073741824).toFixed(2) + ' GB';
  } else {
    return (bytes / 1099511627776).toFixed(2) + ' TB';
  }
}

// based on the excellent article at: https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications
export function fileListTotalSize(fileList) {
  let numberOfBytes = 0;
  for (const file of fileList) {
    numberOfBytes += file.size;
  }

  const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  const exponent = Math.min(Math.floor(Math.log(numberOfBytes) / Math.log(1024)), units.length - 1);
  const approx = numberOfBytes / 1024 ** exponent;
  const output =
    exponent === 0 ? `${numberOfBytes} bytes` : `${approx.toFixed(3)} ${units[exponent]} (${numberOfBytes} bytes)`;
  return output;
}

export function formatDateForFilename(date) {
  // Months array
  const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

  // Getting the parts of the date
  let month = months[date.getMonth()];
  let day = date.getDate();
  let year = date.getFullYear();
  let hour = date.getHours();
  let minute = date.getMinutes();
  let second = date.getSeconds();

  // Formatting the hour for 12-hour format and getting AM/PM
  let ampm = hour >= 12 ? 'pm' : 'am';
  hour = hour % 12;
  hour = hour ? hour : 12; // the hour '0' should be '12'

  // Adding leading zeros to minutes and seconds if needed
  minute = minute < 10 ? '0' + minute : minute;
  second = second < 10 ? '0' + second : second;

  // Constructing the format
  return `${month}-${day}-${year}-${hour}-${minute}-${second}${ampm}`;
}
