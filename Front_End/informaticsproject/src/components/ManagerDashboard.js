import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar } from 'recharts';
import "../styles/css/dashboard.css";
import { FaBox, FaTags, FaUsers, FaDollarSign } from 'react-icons/fa';
import axios from "axios";
import ManagerDashboardLayout from './ManagerDashboardLayout';

const pieChartColours = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#5DADE2', '#F5B041', '#48C9B0', '#DC7633', '#AF7AC5'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const ManagerDashboard = () => {
  const [numProducts, setNumProducts] = useState(0);
  const [numCategories, setNumCategories] = useState(0);
  const [numUsers, setNumUsers] = useState(0);
  const [revenue, setRevenue] = useState(0.0);
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:58398/Service1.svc/GetReportData`)
      .then((response) => {
        if (response.data) {
          const { NumProducts, NumCategories, NumUsers, TotalRevenue } = response.data;
          setNumProducts(NumProducts);
          setNumCategories(NumCategories);
          setNumUsers(NumUsers);
          setRevenue(TotalRevenue);
        }
      });

    axios.get('http://localhost:58398/Service1.svc/GetCategoryRevenues')
      .then((response) => {
        if (response.data) {
          setPieData(response.data);
        }
      });

    axios.get('http://localhost:58398/Service1.svc/GetTop5Products')
      .then((response) => {
        if (response.data) {
          setBarData(response.data);
        }
      });
  }, []);

  // Calculate the total value of all categories for percentage calculations
  const totalValue = pieData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    

      <ManagerDashboardLayout>

<div className="content">
        <h2><b>Manager Dashboard</b></h2>

        <div className="stats-blocks">
          <div className="stat-block blue">
            <FaBox className="stat-icon" />
            <div className="statName">Number of Products: </div>
            <div className="stat-value-large"> {numProducts}</div>
          </div>
          <div className="stat-block red">
            <FaTags className="stat-icon" />
            <div className="statName">Number of Categories: </div>
            <div className="stat-value-large"> {numCategories}</div>
          </div>
          <div className="stat-block yellow">
            <FaUsers className="stat-icon" />
            <div className="statName">Registered Users: </div>
            <div className="stat-value-large"> {numUsers}</div>
          </div>
          <div className="stat-block green">
            <FaDollarSign className="stat-icon" />
            <div className="statName">Total Sales: </div>
            <div className="stat-value-large"> R{revenue.toFixed(2)}</div>
          </div>
        </div>

        <div className="charts-container">
          {/* PieChart for Revenue Percentage */}
          <div className="chart-wrapper">
            <h3>Revenue Percentage by Category</h3>
            <div className="piechart-legend-container">
              <ResponsiveContainer width="50%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieChartColours[index % pieChartColours.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              {/* Legend with Percentages */}
              <div className="legend">
                {pieData.map((entry, index) => (
                  <div key={`legend-${index}`} className="legend-item">
                    <div
                      className="color-box"
                      style={{ backgroundColor: pieChartColours[index % pieChartColours.length] }}
                    />
                    <span>{entry.name}: {(entry.value / totalValue * 100).toFixed(2)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* BarChart for Top 5 Products */}
          <div className="chart-wrapper">
            <h3>Top 5 Products by Sales</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={barData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ProductName" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="NumSold" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      </ManagerDashboardLayout>
    
  );
};

export default ManagerDashboard;
