import React, { useEffect, useState } from 'react'
import './Statistics.css'
import OrdersGraph from './OrdersGraph';
import demoOrders from './demoOrders';
import OrdersByProduct from './OrdersByProduct';
import OrdersByRegionGraph from './OrdersByRegionGraph';
import UserOrderStatsTable from './UserOrderStatsTable';
import GenderPieChart from './GenderPieChart';
import ProductByGender from './ProductByGender';

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  const Statistics = () => {
    const [orderCount, setOrderCount] = useState(0);
    const [revenue, setRevenue] = useState(0);
    const [orders, setOrders] = useState([]);
  
    useEffect(() => {
      const fetchOrders = async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/getallorders`);
          const data = await res.json();
          if (data.success) {
            setOrders(data.orders);
  
            const totalOrders = data.orders.length;
            const totalRevenue = data.orders.reduce(
              (acc, order) => acc + (order.amount || 0),
              0
            );
  
            // Animate counter
            let count = 0;
            let rev = 0;
            const interval = setInterval(() => {
              if (count < totalOrders) {
                setOrderCount((prev) => Math.min(prev + 1, totalOrders));
                count++;
              }
  
              if (rev < totalRevenue) {
                setRevenue((prev) =>
                  Math.min(prev + Math.ceil(totalRevenue / 50), totalRevenue)
                );
                rev += Math.ceil(totalRevenue / 50);
              }
  
              if (count >= totalOrders && rev >= totalRevenue) {
                clearInterval(interval);
              }
            }, 40);
          }
        } catch (err) {
          console.error("Failed to fetch orders:", err);
        }
      };
  
      fetchOrders();
    }, []);
  
    return (
      <div className="statistics-container">
        <h2 className="stats-heading">Store Overview</h2>
        <div className="stats-grid">
          <div className="stat-card orders-card">
            <h3>Total Orders</h3>
            <p className="stat-number">{orderCount}</p>
          </div>
          <div className="stat-card revenue-card">
            <h3>Total Revenue</h3>
            <p className="stat-number">₹{revenue.toLocaleString()}</p>
          </div>
        </div>
        <div className='stats-grid'>
        <OrdersGraph orders={orders} />
        </div>
        <div className='stats-grid'>
          <OrdersByProduct orders={orders}/>
        </div>
        <div className='stats-grid'>
          <OrdersByRegionGraph orders={orders}/>
        </div>
        <div className='stats-grid'>
          <UserOrderStatsTable orders={orders}/>
        </div>
        <div className='stats-grid'>
          <GenderPieChart orders={orders}/>
          <ProductByGender orders={orders}/>
        </div>
      </div>
    );
  };
  
  export default Statistics;