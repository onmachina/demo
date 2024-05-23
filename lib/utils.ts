export function formatDate(utcTimeStamp: string): string {
  const date = new Date(utcTimeStamp + 'Z');
  const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const formattedTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

  return `${formattedDate} at ${formattedTime}`;
}

export function formatFileSize(bytes: number): string {
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
export function fileListTotalSize(fileList: File[]): string {
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
