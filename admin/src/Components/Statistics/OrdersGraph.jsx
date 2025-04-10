import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label,
} from "recharts";
import "./OrdersGraph.css";

const groupBy = (orders, filter) => {
  const grouped = {};

  orders.forEach((order) => {
    const date = new Date(order.date);
    let key;

    if (filter === "day") {
      key = date.toISOString().split("T")[0]; // YYYY-MM-DD
    } else if (filter === "week") {
      const firstDayOfWeek = new Date(date);
      firstDayOfWeek.setDate(date.getDate() - date.getDay());
      key = firstDayOfWeek.toISOString().split("T")[0];
    } else if (filter === "month") {
      key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
    } else if (filter === "year") {
      key = date.getFullYear().toString();
    }

    grouped[key] = (grouped[key] || 0) + 1;
  });

  // Convert to array and sort
  return Object.entries(grouped)
    .map(([key, value]) => ({ time: key, orders: value }))
    .sort((a, b) => new Date(a.time) - new Date(b.time));
};

const OrdersGraph = ({ orders }) => {
  const [filter, setFilter] = useState("month");
  const [data, setData] = useState([]);

  useEffect(() => {
    const groupedData = groupBy(orders, filter);
    setData(groupedData);
  }, [orders, filter]);

  return (
    <div className="orders-graph-container">
      <div className="graph-header">
        <h3>Orders Over Time</h3>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="day">By Day</option>
          <option value="week">By Week</option>
          <option value="month">By Month</option>
          <option value="year">By Year</option>
        </select>
      </div>

      <div className="scrollable-chart" >
  <div
    style={{
      minWidth: `${Math.max(data.length * 80, 960)}px`, // 80px per bar
      height: '300px',
    }}
  >
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 10, bottom: 30 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="time"
          interval={0}
          angle={-45}
          textAnchor="end"
          height={60}
        >
          <Label value={filter.toUpperCase()} offset={-5} position="insideBottom" />
        </XAxis>
        <YAxis allowDecimals={false}>
          <Label
            value="Number of Orders"
            angle={-90}
            position="insideLeft"
            style={{ textAnchor: "middle" }}
          />
        </YAxis>
        <Tooltip />
        <Bar dataKey="orders" fill="#007bff" />
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>


    </div>
  );
};

export default OrdersGraph;
