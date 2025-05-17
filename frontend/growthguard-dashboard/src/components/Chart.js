import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const Chart = ({ data, title, xField, yField, color }) => {
  return (
    <div className="chart-container">
      <h3 className="chart-title">{title}</h3>
      <LineChart
        width={400}
        height={250}
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xField} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey={yField}
          stroke={color}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </div>
  );
};

export default Chart;