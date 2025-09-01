import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import apiService from '../services/api';

const TopProductsChart = () => {
  const [data, setData] = useState([]);
  const [sortBy, setSortBy] = useState('revenue');

  useEffect(() => { loadData(); }, [sortBy]);

  const loadData = async () => {
    const res = await apiService.getTopProducts(10, sortBy);
    if (res.success) setData(res.data);
  };

  return (
    <div>
      <div className="chart-header">
        <h3 className="chart-title">Top Products</h3>
        <div className="chart-controls">
          <button onClick={()=>setSortBy('revenue')}>By Revenue</button>
          <button onClick={()=>setSortBy('quantity')}>By Quantity</button>
          <button onClick={()=>setSortBy('profit')}>By Profit</button>
        </div>
      </div>
      <div className="chart-wrapper">
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid/><XAxis dataKey="description"/><YAxis/><Tooltip/>
            <Bar dataKey={sortBy}><Cell /></Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TopProductsChart;
