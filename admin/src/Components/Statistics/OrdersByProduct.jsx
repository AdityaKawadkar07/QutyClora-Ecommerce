import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";
import "./OrdersByProduct.css";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const OrdersByProduct = ({ orders }) => {
  const [productOrderData, setProductOrderData] = useState([]);

  useEffect(() => {
    const fetchAndMapProducts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/allproducts`);
        const products = await res.json();

        // Create a map of product names and initial order counts = 0
        const productMap = {};
        products.forEach((p) => {
          productMap[p.name] = 0;
        });

        // Go through each order and update total quantity sold per product
        orders.forEach((order) => {
          order.items.forEach(({ name, quantity }) => {
            if (productMap.hasOwnProperty(name)) {
              productMap[name] += quantity;
            } else {
              // Just in case product is no longer listed but sold before
              productMap[name] = quantity;
            }
          });
        });

        // Convert to array for chart
        const finalData = Object.entries(productMap).map(([product, orders]) => ({
          product,
          orders,
        }));

        // Sort by number of orders descending (optional)
        finalData.sort((a, b) => b.orders - a.orders);

        setProductOrderData(finalData);
      } catch (err) {
        console.error("Error generating order stats by product:", err);
      }
    };

    if (orders && orders.length > 0) {
      fetchAndMapProducts();
    }
  }, [orders]);

  return (
    <div className="orders-graph-container">
      <div className="graph-header">
        <h3>Orders by Product</h3>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={productOrderData}
          margin={{ top: 20, right: 30, left: 10, bottom: 30 }}
          layout="vertical"
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" allowDecimals={false}>
            <Label
              value="Number of Items Sold"
              position="insideBottom"
              offset={-10}
              style={{ textAnchor: "middle" }}
            />
          </XAxis>
          <YAxis
            type="category"
            dataKey="product"
            width={150}
            tick={{ fontSize: 14, fontWeight: 500, dy: 6 }}
            interval={0}
          />
          <Tooltip />
          <Bar dataKey="orders" fill="#28a745" barSize={24} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OrdersByProduct;
