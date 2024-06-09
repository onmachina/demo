import { useEffect, useState } from 'react';
import { auth0AuthProvider } from '../../lib/auth';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function UsagePage() {
  const [accountID, setAccountId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accountID = await auth0AuthProvider.username();
        setAccountId(accountID);
        const data = await auth0AuthProvider.fetchMetrics();
        console.log(data); // Log the data to the console
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [accountID]);

  return (
    <div className="container ml-8  text-slate-400 max-w-3xl">
      <h1 className="text-3xl mb-4 font-bold text-white">Account usage</h1>

      <h2 className="text-xl text-slate-400 mb-2">Current period</h2>
      <p className="mb-8 text-slate-500">Your current billing cycle runs from May 13, 2024 to June 13, 2024</p>

      <div className="flex mb-12 gap-2">
        <div className="p-8 bg-ui-active w-1/2">
          <h3 className="text-cyan-300 text-xl">Bandwidth</h3>
          <p>
            <span className="text-slate-300">186 GB</span> transferred so far
          </p>
        </div>

        <div className="p-8 bg-ui-active w-1/2">
          <h3 className="text-orange-400 text-xl">Storage</h3>
          <p>
            <span className="text-slate-300">90 GB</span> average stored
          </p>
        </div>
      </div>

      <h2 className="text-xl text-slate-400 mb-8">Bandwidth usage over time</h2>

      <Line
        data={{
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
          datasets: [
            {
              label: 'Bandwidth',
              data: [65, 100, 70, 81, 84, 83, 89],
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            x: {
              grid: {
                color: 'rgb(42 44 59)',
              },
            },
            y: {
              grid: {
                color: 'rgb(42 44 59)',
              },
            },
          },
        }}
      />

      <h2 className="mt-12 text-xl text-slate-400 mb-8">Storage usage over time</h2>

      <Line
        data={{
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
          datasets: [
            {
              label: 'Storage',
              data: [65, 70, 80, 81, 84, 83, 89],
              fill: false,
              borderColor: 'rgb(255 170 1)',
              tension: 0,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            x: {
              grid: {
                color: 'rgb(42 44 59)',
              },
            },
            y: {
              grid: {
                color: 'rgb(42 44 59)',
              },
            },
          },
        }}
      />
    </div>
  );
}
