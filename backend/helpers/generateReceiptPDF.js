// utils/generateReceiptPDF.js
import PDFDocument from 'pdfkit';
import fs from 'fs';

const generateReceiptPDF = (order, filePath) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40 });
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    // ===== Header =====
    doc.fontSize(22).fillColor('#333').text('QutyClora - Order Receipt', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(10).fillColor('#666').text('support@inarcchmart.com | +91 98765 43210', { align: 'center' });
    doc.moveDown(1);
    doc.moveTo(40, doc.y).lineTo(550, doc.y).strokeColor('#ccc').stroke();
    doc.moveDown(1);

    // ===== Order & Customer Info =====
    doc.fontSize(12).fillColor('#000');
    doc.text(`Order ID: ${order.orderId}`);
    doc.text(`Order Date: ${order.date}`);
    doc.text(`Shipping Address: ${order.address}`);
    if (order.phone) doc.text(`Phone: ${order.phone}`);
    doc.moveDown();
    doc.moveTo(40, doc.y).lineTo(550, doc.y).strokeColor('#ccc').stroke();
    doc.moveDown(0.8);

    // ===== Item Table Headers =====
    const headers = {
      srNo: 50,
      product: 100,
      qty: 330,
      price: 380,
      total: 450,
    };

    doc.fontSize(12).font('Helvetica-Bold');
    doc.text('Sr No.', headers.srNo, doc.y);
    doc.text('Product', headers.product, doc.y);
    doc.text('Qty', headers.qty, doc.y, { width: 40, align: 'right' });
    doc.text('Price', headers.price, doc.y, { width: 60, align: 'right' });
    doc.text('Total', headers.total, doc.y, { width: 60, align: 'right' });

    doc.moveDown(0.3);
    doc.strokeColor('#ccc').moveTo(40, doc.y).lineTo(550, doc.y).stroke();

    // ===== Items =====
    let subtotal = 0;
    order.items.forEach((item, i) => {
      const total = item.quantity * item.price;
      subtotal += total;

      const y = doc.y;
      doc.fontSize(11).fillColor('#000').font('Helvetica');
      doc.text(i + 1, headers.srNo, y);
      doc.text(item.name, headers.product, y, { width: 210 });
      doc.text(item.quantity.toString(), headers.qty, y, { width: 40, align: 'right' });
      doc.text(`₹${item.price.toFixed(2)}`, headers.price, y, { width: 60, align: 'right' });
      doc.text(`₹${total.toFixed(2)}`, headers.total, y, { width: 60, align: 'right' });
    });

    doc.moveDown(1.5);
    doc.moveTo(40, doc.y).lineTo(550, doc.y).strokeColor('#ccc').stroke();
    doc.moveDown(1);

    // ===== Summary =====
    doc.fontSize(12).font('Helvetica-Bold').text('Order Summary:', { underline: true });
    doc.moveDown(0.5);
    doc.font('Helvetica');
    doc.text(`Subtotal: ₹${order.subtotal.toFixed(2)}`);
    if (order?.discount_name) {
      doc.text(`Discount (${order.discount_name}): -₹${order.discount_amount.toFixed(2)}`);
    }
    doc.text('Shipping: Free');
    doc.moveDown(0.5);
    doc.font('Helvetica-Bold').text(`Total Paid: ₹${order.amount.toFixed(2)}`);

    doc.moveDown(2);
    doc.fontSize(10).fillColor('#666').text('Thank you for shopping with QutyClora!', { align: 'center' });

    doc.end();
    stream.on('finish', () => resolve());
    stream.on('error', reject);
  });
};

export default generateReceiptPDF;
