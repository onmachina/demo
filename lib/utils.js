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
