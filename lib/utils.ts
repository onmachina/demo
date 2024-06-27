export function formatDate(utcTimeStamp: string): string {
  const date = new Date(utcTimeStamp + 'Z');
  const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const formattedTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

  return `${formattedDate} at ${formattedTime}`;
}

export function dayAndMonth(utcTimeStamp: string): { day: string; month: string } {
  const date = new Date(utcTimeStamp + 'Z');
  const twoDigitDayOfMonth = date.toLocaleDateString('en-US', { day: '2-digit' });
  const month = date.toLocaleDateString('en-US', { month: 'long' });
  return {
    day: twoDigitDayOfMonth,
    month: month,
  };
}

export function timeOnly(utcTimeStamp: string): string {
  const date = new Date(utcTimeStamp + 'Z');
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
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

export function organizeMetricsByDate(metrics) {
  const result = {};
  let largestCombinedTotal = 0;
  let totalBandwidth = 0;

  function processEvent(event, type) {
    const date = new Date(Number(event.ts) * 1000).toISOString().split('T')[0]; // Convert timestamp to date string

    // 12 hour clock format without seconds
    const time = new Date(Number(event.ts) * 1000).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });

    if (!result[date]) {
      result[date] = {
        date: date,
        events: [],
        totals: {
          upload: 0,
          download: 0,
          combined: 0,
        },
      };
    }

    totalBandwidth += event.bytes;

    result[date].events.push({
      type: type,
      ts: time,
      bytes: event.bytes,
    });

    const bytes = Number(event.bytes);
    result[date].totals[type] += bytes;
    result[date].totals.combined += bytes;

    if (result[date].totals.combined > largestCombinedTotal) {
      largestCombinedTotal = result[date].totals.combined;
    }
  }

  metrics.current_period.download.forEach((event) => processEvent(event, 'download'));
  metrics.current_period.upload.forEach((event) => processEvent(event, 'upload'));

  return {
    data: Object.values(result),
    largestCombinedTotal: largestCombinedTotal,
    totalBandwidth: totalBandwidth,
  };
}

export const timeStampToDate = (timestamp) => new Date(Number(timestamp) * 1000).toISOString().split('T')[0]; // Convert timestamp to date string
