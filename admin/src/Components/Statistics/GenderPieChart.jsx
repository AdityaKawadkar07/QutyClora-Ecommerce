import React, { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer, Sector
} from 'recharts';
import './GenderPieChart.css';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
const NAMSOR_API_KEY = import.meta.env.VITE_NAMSOR_API_KEY;

const COLORS = ['#0088FE', '#FF69B4', '#AAAAAA']; // Male, Female, Unknown

const renderActiveShape = (props) => {
  const {
    cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill
  } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

const fetchGenderData = async (firstName, lastName = 'Doe') => {
  try {
    const response = await fetch(`https://v2.namsor.com/NamSorAPIv2/api2/json/gender/${firstName}/${lastName}`, {
      headers: {
        'X-API-KEY': NAMSOR_API_KEY
      }
    });
    const data = await response.json();
    const gender = data?.likelyGender?.toLowerCase();
    return gender === 'male' || gender === 'female' ? gender : 'unknown';
  } catch (error) {
    console.error(`Error fetching gender from NamSor for "${firstName} ${lastName}"`, error);
    return 'unknown';
  }
};

const GenderPieChart = ({ orders }) => {
  const [genderData, setGenderData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  const handleMouseEnter = (_, index) => setActiveIndex(index);
  const handleMouseLeave = () => setActiveIndex(-1);

  useEffect(() => {
    if (!orders || orders.length === 0) return;

    const cachedGenderMap = JSON.parse(localStorage.getItem("genderMap") || '{}');
    const cachedChartData = JSON.parse(localStorage.getItem("genderChartData") || 'null');
    const cachedOrderDataHash = localStorage.getItem("genderOrderCache");

    const currentOrderDataHash = JSON.stringify(orders.map(order => ({
      id: order._id,
      name: order?.address?.addressLine,
      date: order.date
    })));

    if (cachedChartData && cachedOrderDataHash === currentOrderDataHash) {
      setGenderData(cachedChartData);
      console.log("✅ Used cached gender chart data");
      return;
    }

    const processGenderData = async () => {
      const genderCount = { male: 0, female: 0, unknown: 0 };
      const updatedGenderMap = { ...cachedGenderMap };

      for (const order of orders) {
        const addressLine = order?.address?.addressLine;
        if (!addressLine) continue;

        const nameParts = addressLine.trim().split(' ');
        const firstName = nameParts[0]?.toLowerCase() || '';
        const lastName = nameParts[1]?.toLowerCase() || 'doe';

        const cacheKey = `${firstName}_${lastName}`;

        let gender = updatedGenderMap[cacheKey];
        if (gender) {
          console.log(`→ Cached gender for "${firstName} ${lastName}": ${gender}`);
        } else {
          gender = await fetchGenderData(firstName, lastName);
          updatedGenderMap[cacheKey] = gender;
          console.log(`→ Fetched gender for "${firstName} ${lastName}": ${gender}`);
        }

        if (genderCount[gender] !== undefined) {
          genderCount[gender]++;
        } else {
          genderCount.unknown++;
        }
      }

      const chartData = [
        { name: 'Male', value: genderCount.male },
        { name: 'Female', value: genderCount.female },
        { name: 'Unknown', value: genderCount.unknown }
      ];

      localStorage.setItem("genderMap", JSON.stringify(updatedGenderMap));
      localStorage.setItem("genderChartData", JSON.stringify(chartData));
      localStorage.setItem("genderOrderCache", currentOrderDataHash);

      setGenderData(chartData);
    };

    processGenderData();
  }, [orders]);

  return (
    <div className="gender-chart-card">
      <h3>Orders by Gender</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={genderData}
            cx="50%"
            cy="50%"
            dataKey="value"
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {genderData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value} Orders`} />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GenderPieChart;
