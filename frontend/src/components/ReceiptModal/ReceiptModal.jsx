import React, { useContext, useRef } from 'react';
import './ReceiptModal.css';
import { ShopContext } from '../../context/ShopContext';
import html2canvas from 'html2canvas'
import {jsPDF} from 'jspdf'
import {FaDownload} from 'react-icons/fa'


const ReceiptModal = ({ order, onClose }) => {

    const {getCartProductDetails} = useContext(ShopContext)
    const cartDetails = getCartProductDetails();
    const receiptRef = useRef(null);

  if (!order) return null;

//   const calculateTotalAmount = () => {
//     return order.items.reduce((total, item) => total + item.quantity * item.price, 0);
//   };

const downloadReceipt = () => {
    const input = receiptRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
      pdf.save(`QutyClora_Receipt_${order.orderId}.pdf`);
    });
  };

  const totalAmount = order.amount + order.discount.discount_amount;

  return (
    <div className="receipt-modal-overlay" onClick={onClose}>
      <div className="receipt-modal" onClick={(e) => e.stopPropagation()}>
        {/* 🎉 Add Download Button at the Top Right */}
        <button className="receipt-download-btn" onClick={downloadReceipt}>
          <FaDownload /> Download
        </button>

        <div ref={receiptRef}> {/* Add ref to capture receipt */}
          <div className="receipt-header">
            <h2>QutyClora</h2>
            <p>Email: <a href="mailto:support@inarcchmart.com">support@inarcchmart.com</a></p>
            <p>Phone: +91 98765 43210</p>
          </div>

          <hr className="receipt-divider" />

          <div className="receipt-customer-info">
            <p><strong>Order ID:</strong> {order.orderId}</p>
            <p><strong>Delivering Address:</strong> {order.address.addressLine}</p>
            <p><strong>Phone No:</strong> {order.address.phoneNo}</p>
          </div>

          <hr className="receipt-divider" />

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
              {cartDetails.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>₹{item.price.toFixed(2)}</td>
                  <td>₹{item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <hr className="receipt-divider" />

          <div className="receipt-summary">
            <p><strong>Subtotal:</strong> ₹{totalAmount.toFixed(2)}</p>
            <p><strong>Shipping:</strong> Free</p>
            <p><strong>Disocunt:</strong>₹{order.discount.discount_amount.toFixed(2)}</p>
            <p className="receipt-total"><strong>Total Amount:</strong> ₹{order.amount.toFixed(2)}</p>
          </div>

          <hr className="receipt-divider" />

          <div className="receipt-img-container">
            <h4>Payment Receipt:</h4>
          </div>
        </div>

        <button className="receipt-close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );

};

export default ReceiptModal;
