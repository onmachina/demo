import { useLoaderData } from 'react-router-dom';
import { auth0AuthProvider } from '../../lib/auth';
import {
  organizeMetricsByDate,
  dayAndMonth,
  timeOnly,
  formatFileSize,
  formatDate,
  timeStampToDate,
} from '../../lib/utils';

export const UsageView = () => {
  // const { metrics } = useLoaderData();

  const usageData = {
    bandwidth: [
      {
        total_usage: 26804483,
        period: {
          end: null,
          start: 1716550904,
        },
      },
      {
        total_usage: 292731,
        period: {
          end: 1716550904,
          start: 1713959137,
        },
      },
    ],
    storage: [
      {
        total_usage: 26804483,
        period: {
          end: null,
          start: 1716550904,
        },
      },
      {
        total_usage: 292731,
        period: {
          end: 1716550904,
          start: 1713959137,
        },
      },
    ],
    download: [
      {
        ts: '1718021700',
        bytes: '398538',
      },
      {
        ts: '1718022000',
        bytes: '2313980',
      },
      {
        ts: '1718022300',
        bytes: '4627960',
      },
      {
        ts: '1718023200',
        bytes: '2911787',
      },
      {
        ts: '1718035500',
        bytes: '2313980',
      },
      {
        ts: '1718045700',
        bytes: '2313980',
      },
      {
        ts: '1718047800',
        bytes: '2313980',
      },
      {
        ts: '1718320800',
        bytes: '2500600',
      },
      {
        ts: '1718321100',
        bytes: '2712518',
      },
      {
        ts: '1718321400',
        bytes: '1177382',
      },
      {
        ts: '1718839200',
        bytes: '1064238',
      },
      {
        ts: '1718839500',
        bytes: '665700',
      },
    ],
    upload: [
      {
        ts: '1718022000',
        bytes: '1156990',
      },
      {
        ts: '1718321400',
        bytes: '332850',
      },
    ],
  };

  console.log(usageData.bandwidth[0].period.start);

  const billingPeriod = {
    start: dayAndMonth(timeStampToDate(usageData.bandwidth[0].period.start)),
  };

  const metricsByDate = organizeMetricsByDate(usageData).data;
  const laregestCombinedTotal = organizeMetricsByDate(usageData).largestCombinedTotal;
  const barWidth = (total) => Math.round((total / laregestCombinedTotal) * 200);

  console.log(metricsByDate);
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
            <span className="text-slate-300">{formatFileSize(usageData.bandwidth[0].total_usage)}</span> transferred so
            far
          </p>
        </div>

        <div className="p-8 bg-ui-active w-1/2">
          <h3 className="text-orange-400 text-xl">Storage</h3>
          <p>
            <span className="text-slate-300">{formatFileSize(usageData.storage[0].total_usage)}</span> average stored
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
  const metrics = await auth0AuthProvider.fetchMetrics();
  return { metrics };
}
