import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import apiService from '../services/api';

const colors = ['#28a745','#007bff','#17a2b8','#6f42c1','#ffc107','#fd7e14','#dc3545','#6c757d'];

const CustomerSegmentsPie = () => {
  const [data, setData] = useState([]);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const res = await apiService.getCustomerSegments();
    if (res.success) setData(res.summary.map((s,i)=>({...s,color:colors[i%colors.length]})));
  };

  return (
    <div>
      <div className="chart-header">
        <h3 className="chart-title">Customer Segments</h3>
      </div>
      <div className="chart-wrapper">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="count" nameKey="segment" cx="50%" cy="50%" outerRadius={120}>
              {data.map((entry,i)=><Cell key={i} fill={entry.color}/>)}
            </Pie>
            <Tooltip/><Legend/>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CustomerSegmentsPie;
