import React, { useEffect, useState } from 'react';
import './UserOrderStatsTable.css';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const UserOrderStatsTable = ({ orders }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [userStats, setUserStats] = useState([]);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/allusers`);
      const data = await res.json();
      setAllUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Generate stats by mapping orders to users
  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (allUsers.length === 0 || orders.length === 0) return;

    const userMap = {};
    allUsers.forEach(user => {
      userMap[user._id] = user;
    });

    const orderCountByUser = {};

    orders.forEach(order => {
      const user = userMap[order.userId];
      if (user) {
        const email = user.email;
        if (orderCountByUser[email]) {
          orderCountByUser[email].orders += 1;
        } else {
          orderCountByUser[email] = {
            name: user.name,
            email: user.email,
            mobile: order.address?.phoneNo || "N/A",
            orders: 1,
          };
        }
      }
    });

    // Convert to array
    const statsArray = Object.values(orderCountByUser).sort((a, b) => b.orders - a.orders);
    setUserStats(statsArray);
  }, [orders, allUsers]);

  return (
    <div className="user-stats-container">
      <h3 className="table-heading">User Order Statistics</h3>
      <div className="table-wrapper">
        <table className="user-stats-table">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Total Orders</th>
            </tr>
          </thead>
          <tbody>
            {userStats.length === 0 ? (
              <tr><td colSpan="4">No order data available.</td></tr>
            ) : (
              userStats.map((user, index) => (
                <tr key={index}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.mobile}</td>
                  <td>{user.orders}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserOrderStatsTable;
