 
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = ({ metrics }) => {
  const data = [
    { name: 'Purity', value: metrics?.purity ?? 0 },
    { name: 'Stability', value: metrics?.stability ?? 0 },
    { name: 'Latency', value: metrics?.latency ?? 0 },
    { name: 'Interpretability', value: metrics?.interpretability ?? 0 }
  ];

  return (
    <div>
      <h2>Segmentation Metrics</h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Dashboard;
