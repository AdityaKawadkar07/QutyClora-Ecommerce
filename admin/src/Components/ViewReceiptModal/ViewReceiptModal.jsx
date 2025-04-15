// src/components/ViewReceiptModal.jsx
import React, { useEffect, useRef, useState } from 'react';
import './ViewReceiptModal.css';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { FaDownload } from 'react-icons/fa';

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const ViewReceiptModal = ({ order, onClose, getUserName }) => {
  const receiptRef = useRef(null);
  const [productsMap, setProductsMap] = useState({})

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/allproducts`);
      const data = await res.json();

      // Create a map of product names to new_price
      const map = {};
      data.forEach(product => {
        map[product.name] = product.new_price;
      });

      setProductsMap(map);
    } catch (error) {
      console.error("Failed to fetch product data", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);


  if (!order) return null;

  const totalAmount = order.amount + order.discount.discount_amount;

  const downloadReceipt = () => {
    const input = receiptRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 10;
      const usableWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height * usableWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', margin, 10, usableWidth, imgHeight);
      pdf.save(`QutyClora_Receipt_${order.orderId}.pdf`);
    });
  };

  return (
    <div className="receipt-modal-overlay" onClick={onClose}>
      <div className="receipt-modal" onClick={(e) => e.stopPropagation()}>
        {/* Download Button */}
        <button className="receipt-download-btn" onClick={downloadReceipt}>
          <FaDownload /> Download
        </button>

        <div ref={receiptRef}>
          {/* Header */}
          <div className="receipt-header">
            <h2>QutyClora</h2>
            <p>Email: <a href="mailto:support@inarcchmart.com">support@inarcchmart.com</a></p>
            <p>Phone: +91 98765 43210</p>
          </div>

          <hr className="receipt-divider" />

          {/* Customer Info */}
          <div className="receipt-customer-info">
            <p><strong>Order ID:</strong> {order.orderId}</p>
            <p><strong>Customer:</strong> {getUserName(order.userId)}</p>
            <p><strong>Delivering Address:</strong> {order.address.addressLine}</p>
            <p><strong>Phone No:</strong> {order.address.phoneNo}</p>
          </div>

          <hr className="receipt-divider" />

          {/* Items Table */}
          <table className="receipt-table">
            <thead>
              <tr>
                <th>Sr No.</th>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Rate</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
            {order.items.map((item, index) => {
                const rate = productsMap[item.name] || 0;
                const total = rate * item.quantity;

                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>₹{rate.toFixed(2)}</td>
                    <td>₹{total.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <hr className="receipt-divider" />

          {/* Summary */}
          <div className="receipt-summary">
            <p><strong>Cost Before Discount:</strong> ₹{totalAmount.toFixed(2)}</p>
            <p><strong>Shipping:</strong> Free</p>
            {order.discount.discount_amount > 0 && (
              <>
                <p><strong>Discount:</strong> {order.discount.discount_name}</p>
                <p><strong>Discount Amount:</strong> ₹{order.discount.discount_amount.toFixed(2)}</p>
              </>
            )}
            <p className="receipt-total"><strong>Total Paid:</strong> ₹{order.amount.toFixed(2)}</p>
          </div>

          <hr className="receipt-divider" />

        </div>

        {/* Close Button */}
        <button className="receipt-close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ViewReceiptModal;
