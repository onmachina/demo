import { useLoaderData } from 'react-router-dom';
import { authProvider } from '../../lib/auth';
import {
  organizeMetricsByDate,
  dayAndMonth,
  timeOnly,
  formatFileSize,
  formatDate,
  timeStampToDate,
} from '../../lib/utils';

export const UsageView = () => {
  const { metrics } = useLoaderData();

  let billingPeriod, metricsByDate, largestValue, totalBandwidthForPeriod;

  try {
    billingPeriod = {
      start: dayAndMonth(timeStampToDate(metrics.current_period.start)),
    };

    const { data, largestCombinedTotal, totalBandwidth } = organizeMetricsByDate(metrics);
    metricsByDate = data;
    largestValue = largestCombinedTotal;
    totalBandwidthForPeriod = totalBandwidth;
  } catch (error) {
    console.log(error);
    return (
      <div className="container ml-8  text-slate-400 max-w-3xl">
        <h1 className="text-3xl mb-4 font-bold text-white">Account usage</h1>
        <p>Usage data is processing and not yet available for this account.</p>
      </div>
    );
  }

  const barWidth = (total) => Math.round((total / largestValue) * 200);

  return (
    <div className="container ml-8  text-slate-400 max-w-3xl">
      <h1 className="text-3xl mb-4 font-bold text-white">Account usage</h1>

      <h2 className="text-xl text-slate-400 mb-2">Current period</h2>
      <p className="mb-4 mt-7 text-slate-500">
        Your current billing cycle started {billingPeriod.start.day} {billingPeriod.start.month}
      </p>

      <div className="flex mb-12 gap-2 w-3/4">
        <div className="p-8 bg-ui-active w-1/2">
          <h3 className="text-cyan-300 text-xl">Bandwidth</h3>
          <p>
            <span className="text-slate-300">{formatFileSize(totalBandwidthForPeriod)}</span> transferred so far
          </p>
        </div>

        <div className="p-8 bg-ui-active w-1/2">
          <h3 className="text-orange-400 text-xl">Storage</h3>
          <p>
            <span className="text-slate-300">{formatFileSize(metrics.storage.total_usage)}</span> average stored
          </p>
        </div>
      </div>

      <h2 className="text-xl text-slate-400 mb-8">Usage logs</h2>

      {Object.keys(metricsByDate).map((date) => (
        <details className="mb-2" open={date == 0}>
          <summary className="flex justify-between text-white w-3/4 cursor-pointer opacity-60 p-2 transition-colors hover:bg-ui-active border-ui-base border border-l-2">
            <h2>
              {dayAndMonth(metricsByDate[date].date).day} {dayAndMonth(metricsByDate[date].date).month}
            </h2>
            <p>
              Transferred: <span className="text-cyan-300">{formatFileSize(metricsByDate[date].totals.combined)}</span>
            </p>
          </summary>
          <table className="ml-6 my-4 w-3/4">
            <tbody>
              {metricsByDate[date].events.map((event) => (
                <tr>
                  <td className="pr-8">{event.ts}</td>
                  <td className="pr-1">
                    <EventArrow event={event} />
                  </td>
                  <td className="pr-8">{event.type}</td>
                  <td className="pr-8">{formatFileSize(event.bytes)}</td>
                  <td className=" text-cyan-300 pr-4">
                    <svg width="200" height="6" viewBox="0 0 200 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width={barWidth(event.bytes)} height="6" fill="currentColor" />
                      <rect x="0.5" y="0.5" width="200" height="5" stroke="#494949" />
                    </svg>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      ))}

      <h2 className="text-xl text-slate-400 mt-12 mb-8">More details</h2>

      <details>
        <summary className="flex justify-between text-white w-3/4 cursor-pointer opacity-60 p-2 transition-colors hover:bg-ui-active border-ui-base border border-l-2">
          <h2>Raw data</h2>
          <p>(JSON format)</p>
        </summary>
        <pre className="ml-6 my-4 w-3/4">{JSON.stringify(metrics, null, 2)}</pre>
      </details>
    </div>
  );
};

const EventArrow = ({ event }) => {
  switch (event.type) {
    case 'upload':
      return (
        <span className="text-teal-200 inline-block aspect-square w-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-2 text-teal-200"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
          </svg>
        </span>
      );
    case 'download':
      return (
        <span className="text-teal-200 inline-block aspect-square w-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
          </svg>
        </span>
      );
  }
};

export async function loader(params) {
  const metrics = await authProvider.fetchMetrics();
  return { metrics };
}
