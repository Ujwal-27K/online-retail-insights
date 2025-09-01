import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import apiService from '../services/api';

const RevenueChart = () => {
  const [data, setData] = useState([]);
  const [period, setPeriod] = useState('monthly');
  const [chartType, setChartType] = useState('line');

  useEffect(() => {
    loadData();
  }, [period]);

  const loadData = async () => {
    const res = await apiService.getRevenueData(period, 12);
    if (res.success) {
      setData(res.data.map(d => ({ ...d, revenue: parseFloat(d.revenue) })));
    }
  };

  return (
    <div>
      <div className="chart-header">
        <h3 className="chart-title">Revenue Trend</h3>
        <div className="chart-controls">
          <button className={period==='daily'?'control-button active':'control-button'} onClick={()=>setPeriod('daily')}>Daily</button>
          <button className={period==='weekly'?'control-button active':'control-button'} onClick={()=>setPeriod('weekly')}>Weekly</button>
          <button className={period==='monthly'?'control-button active':'control-button'} onClick={()=>setPeriod('monthly')}>Monthly</button>
          <button className={chartType==='line'?'control-button active':'control-button'} onClick={()=>setChartType('line')}>Line</button>
          <button className={chartType==='area'?'control-button active':'control-button'} onClick={()=>setChartType('area')}>Area</button>
        </div>
      </div>
      <div className="chart-wrapper">
        <ResponsiveContainer>
          {chartType==='area' ? (
            <AreaChart data={data}><CartesianGrid/><XAxis dataKey="date"/><YAxis/><Tooltip/><Area dataKey="revenue" stroke="#007bff" fill="#007bff"/></AreaChart>
          ) : (
            <LineChart data={data}><CartesianGrid/><XAxis dataKey="date"/><YAxis/><Tooltip/><Line dataKey="revenue" stroke="#007bff"/></LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
