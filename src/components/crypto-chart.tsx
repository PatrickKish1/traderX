
'use client';
import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { CryptoData } from '@/lib/types/crypto';
import { fetchCryptoHistory } from '@/lib/apiUtls';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
interface CryptoChartProps {
  cryptoData: CryptoData;
}
const CryptoChart: React.FC<CryptoChartProps> = ({ cryptoData }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [chartData, setChartData] = useState<any>(null);
  const [timeframe, setTimeframe] = useState<number>(7); // 7 days by default
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    const loadChartData = async () => {
      setIsLoading(true);
      try {
        const historyData = await fetchCryptoHistory(cryptoData.id, timeframe);
        
        // Format the data for Chart.js
        const labels = historyData.prices.map((price: (string | number | Date)[]) => {
          const date = new Date(price[0]);
          return date.toLocaleDateString();
        });
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const priceData = historyData.prices.map((price: any[]) => price[1]);
        
        setChartData({
          labels,
          datasets: [
            {
              label: `${cryptoData.name} Price (USD)`,
              data: priceData,
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              tension: 0.1,
              fill: true,
            },
          ],
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load chart data:', error);
        setIsLoading(false);
      }
    };
    if (cryptoData) {
      loadChartData();
    }
  }, [cryptoData, timeframe]);
  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${cryptoData.name} (${cryptoData.symbol.toUpperCase()}) Price Chart`,
        color: 'white',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          callback: function(value) {
            return '$' + value.toLocaleString();
          },
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };
  const handleTimeframeChange = (days: number) => {
    setTimeframe(days);
  };
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold">{cryptoData.name} Price Chart</h2>
          <p className="text-gray-400">
            Current Price: ${cryptoData.current_price.toLocaleString()}
            <span className={`ml-2 ${cryptoData.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {cryptoData.price_change_percentage_24h >= 0 ? '↑' : '↓'} 
              {Math.abs(cryptoData.price_change_percentage_24h).toFixed(2)}%
            </span>
          </p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => handleTimeframeChange(1)}
            className={`px-3 py-1 rounded ${timeframe === 1 ? 'bg-blue-600' : 'bg-gray-700'}`}
          >
            24h
          </button>
          <button 
            onClick={() => handleTimeframeChange(7)}
            className={`px-3 py-1 rounded ${timeframe === 7 ? 'bg-blue-600' : 'bg-gray-700'}`}
          >
            7d
          </button>
          <button 
            onClick={() => handleTimeframeChange(30)}
            className={`px-3 py-1 rounded ${timeframe === 30 ? 'bg-blue-600' : 'bg-gray-700'}`}
          >
            30d
          </button>
          <button 
            onClick={() => handleTimeframeChange(90)}
            className={`px-3 py-1 rounded ${timeframe === 90 ? 'bg-blue-600' : 'bg-gray-700'}`}
          >
            90d
          </button>
        </div>
      </div>
      
      <div className="h-80">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <p>Loading chart data...</p>
          </div>
        ) : chartData ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <div className="flex justify-center items-center h-full">
            <p>No chart data available</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default CryptoChart;