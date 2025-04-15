import React, { useEffect, useState } from "react";
import "./CSS/MyOrder.css";
import ReceiptModal from "../components/ReceiptModal/ReceiptModal";

const BACKEND_API_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:4000";

const MyOrder = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fetch user orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${BACKEND_API_URL}/getmyorders`, {
          method: "GET",
          headers: {
            "auth-token": `${localStorage.getItem("auth-token")}`,
          },
        });

        const data = await response.json();

        if (data.success) {
          setOrders(data.orders);
        } else {
          setError(data.message || "Failed to load orders");
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Error fetching orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const openReceiptModal = (order) => {
    setSelectedOrder(order);
  };

  const closeReceiptModal = () => {
    setSelectedOrder(null);
  };

  if (loading)
    return <h2 className="myorder-loading">Loading your orders...</h2>;
  if (error) return <h2 className="myorder-error">{error}</h2>;
  if (orders.length === 0)
    return <h2 className="myorder-empty">No orders found!</h2>;

  return (
    <div className="myorder">
      <h1>My Orders</h1>
      <div className="myorder-table">
        <div className="myorder-format myorder-header">
          <p>Order ID</p>
          <p>Products</p>
          <p>Total Cost</p>
          <p>Payment Receipt</p>
          <p>Status</p>
        </div>
        <hr />
        {orders.map((order) => (
          <div key={order.orderId}>
            <div
              className="myorder-format myorder-row"
              onClick={() => toggleOrderDetails(order.orderId)}
            >
              <p>{order.orderId}</p>
              <p className="myorder-toggle">
                {expandedOrder === order.orderId
                  ? "Hide Products"
                  : "View Products"}
              </p>
              <p>₹{order.amount}</p>
              <button
                className="view-receipt-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  openReceiptModal(order);
                }}
              >
                View Receipt
              </button>

              <p
                className={`myorder-status ${order.status
                  .replace(/\s/g, "")
                  .toLowerCase()}`}
              >
                {order.status}
              </p>
            </div>
            {expandedOrder === order.orderId && (
              <div className="myorder-products">
                {order.items.map((product, index) => (
                  <div key={index} className="myorder-product-item">
                    <p>{product.name}</p>
                    <p>Qty: {product.quantity}</p>
                  </div>
                ))}
              </div>
            )}
            <hr />
          </div>
        ))}
      </div>
      {/* Receipt Modal */}
      {selectedOrder && (
        <ReceiptModal order={selectedOrder} onClose={closeReceiptModal} />
      )}
    </div>
  );
};

export default MyOrder;
