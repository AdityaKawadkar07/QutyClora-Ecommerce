import React, { useEffect, useState } from "react";
import "./Orders.css";
import Statistics from "../Statistics/Statistics";
import ViewReceiptModal from "../ViewReceiptModal/ViewReceiptModal";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const Orders = () => {

  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [expandedAddress, setExpandedAddress] = useState(null);
  const [expandedAmount, setExpandedAmount] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const toggleAmountDetails = (orderId) => {
    setExpandedAmount(expandedAmount === orderId ? null : orderId);
  };

  // Fetch orders from backend API
  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/getallorders`);
      const data = await res.json();

      if (data.success) {
        setOrders(data.orders);
      } else {
        console.error("Error fetching orders:", data.message);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/allusers`);
      const data = await res.json();

      setAllUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchUsers();
  }, []);

  // Get user name by matching userId
  const getUserName = (userId) => {
    const user = allUsers.find((user) => user._id === userId);
    return user ? user.name : "Unknown User";
  };

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/updateorderstatus/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (data.success) {
        alert(`Payment status updated to ${newStatus}`);
        fetchOrders(); // Refresh orders after updating
      } else {
        alert("Failed to update payment status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Error updating payment status");
    }
  };

  // Open receipt modal
const handleViewReceipt = (order) => {
  setSelectedOrder(order);
  setShowReceipt(true);
};

// Close receipt modal
const closeReceipt = () => {
  setShowReceipt(false);
  setSelectedOrder(null);
};

  return (
    <div>
    <div className="orders">
      <h1>All Orders</h1>
      <div className="orders-header">
        <p>Order ID</p>
        <p>Products</p>
        <p>Customer</p>
        <p>Address</p>
        <p>Contact</p>
        <p>Items</p>
        <p>Total</p>
        <p>Status</p>
        <p>Receipt</p>
      </div>

      <div className="orders-allorders">
        {orders.map((order, index) => (
          <div key={order._id} className="orders-row">
            <p>{order.orderId}</p>

            {/* Products Dropdown on Hover */}
            <div className="product-info">
              <p
                className="product-hover"
                onClick={() =>
                  setExpandedOrder(expandedOrder === index ? null : index)
                }
              >
                View Items ▼
              </p>
              {expandedOrder === index && (
                <div className="product-dropdown">
                  {order.items.map((item, idx) => (
                    <p key={idx}>
                      {item.name} x {item.quantity}
                    </p>
                  ))}
                </div>
              )}
            </div>

            <p>{getUserName(order.userId)}</p>

            {/* Address Click to Expand */}
            <div className="address-info">
              <p
                className={`address-hover ${
                  expandedOrder === `address-${index}` ? "expanded" : ""
                }`}
                onClick={() =>
                  setExpandedOrder(
                    expandedOrder === `address-${index}`
                      ? null
                      : `address-${index}`
                  )
                }
              >
                {order.address.addressLine.length > 20
                  ? `${order.address.addressLine.substring(0, 20)}...`
                  : order.address.addressLine}
              </p>

              {/* Show Full Address Below When Clicked */}
              {expandedOrder === `address-${index}` && (
                <div className="address-full">
                  <p>{order.address.addressLine}</p>
                </div>
              )}
            </div>

            <p>{order.address.phoneNo}</p>
            <p>{order.items.reduce((acc, item) => acc + item.quantity, 0)}</p>
            <div className="total-amount">
              <p
                className="amount-hover"
                onClick={() => toggleAmountDetails(order._id)}
              >
                ₹{order.amount}{" "}
                <span style={{ cursor: "pointer", color: "#007bff" }}>▼</span>
              </p>
              {expandedAmount === order._id && (
                <div className="amount-details">
                  <p>
                    <b>Cost Before Discount:</b> ₹
                    {order.amount + order.discount.discount_amount}
                  </p>
                  {order.discount.discount_amount > 0 && (
                    <>
                      <p>
                        <b>Discount:</b> {order.discount.discount_name || "N/A"}
                      </p>
                      <p>
                        <b>Discount Amount:</b> ₹
                        {order.discount.discount_amount}
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
            {/* Status Dropdown */}
            <select
              value={order.status}
              onChange={(e) => updateOrderStatus(order._id, e.target.value)}
            >
              <option value="Placed">Placed</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
            <button
  className="view-receipt-btn"
  onClick={() => handleViewReceipt(order)}
>
  View Receipt
</button>
          </div>
        ))}
      </div>
    </div>
    <div className="stats">
      <Statistics/>
    </div>
          {/* View Receipt Modal */}
          {showReceipt && (
        <ViewReceiptModal
          order={selectedOrder}
          onClose={closeReceipt}
          getUserName={getUserName}
        />
      )}
    </div>
  );
};

export default Orders;
