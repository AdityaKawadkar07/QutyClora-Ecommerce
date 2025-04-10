import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Label,
} from "recharts";
import "./ProductByGender.css";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
const NAMSOR_API_KEY = import.meta.env.VITE_NAMSOR_API_KEY;

const fetchGender = async (firstName, lastName = "Doe", cache) => {
  const key = `${firstName.toLowerCase()}_${lastName.toLowerCase()}`;
  if (cache[key]) return cache[key];

  try {
    const res = await fetch(
      `https://v2.namsor.com/NamSorAPIv2/api2/json/gender/${firstName}/${lastName}`,
      {
        headers: {
          "X-API-KEY": NAMSOR_API_KEY,
        },
      }
    );
    const data = await res.json();
    const gender = data?.likelyGender?.toLowerCase();
    const finalGender = gender === "male" || gender === "female" ? gender : "unknown";
    cache[key] = finalGender;
    return finalGender;
  } catch (err) {
    console.error("Gender fetch failed:", err);
    return "unknown";
  }
};

const ProductByGender = ({ orders }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const cachedGenderMap = JSON.parse(localStorage.getItem("productGenderMap") || "{}");
    const cachedChartData = JSON.parse(localStorage.getItem("productGenderChartData") || "null");
    const cachedOrderHash = localStorage.getItem("productGenderOrderCache");

    const currentOrderHash = JSON.stringify(
      orders.map(order => ({
        id: order._id,
        name: order?.address?.addressLine,
        date: order.date
      }))
    );

    if (cachedChartData && cachedOrderHash === currentOrderHash) {
      console.log("✅ Used cached product gender chart data");
      setData(cachedChartData);
      return;
    }

    const processData = async () => {
      if (!orders || orders.length === 0) return;

      const genderCache = { ...cachedGenderMap };
      const res = await fetch(`${API_BASE_URL}/allproducts`);
      const products = await res.json();

      const productGenderMap = {};

      // Initialize all product names
      products.forEach(p => {
        productGenderMap[p.name] = { male: 0, female: 0, unknown: 0 };
      });

      // Loop through each order
      for (const order of orders) {
        const fullName = order?.address?.addressLine || "";
        const [firstName = "", lastName = "Doe"] = fullName.trim().split(" ");
        const gender = await fetchGender(firstName, lastName, genderCache);

        order.items.forEach(({ name, quantity }) => {
          if (!productGenderMap[name]) {
            productGenderMap[name] = { male: 0, female: 0, unknown: 0 };
          }
          productGenderMap[name][gender] += quantity;
        });
      }

      // Prepare chart data
      const finalChartData = Object.entries(productGenderMap).map(([product, g]) => ({
        product,
        Male: g.male,
        Female: g.female,
        Unknown: g.unknown,
      }));

      finalChartData.sort((a, b) => (b.Male + b.Female + b.Unknown) - (a.Male + a.Female + a.Unknown));

      // Save to localStorage
      localStorage.setItem("productGenderMap", JSON.stringify(genderCache));
      localStorage.setItem("productGenderChartData", JSON.stringify(finalChartData));
      localStorage.setItem("productGenderOrderCache", currentOrderHash);

      setData(finalChartData);
    };

    processData();
  }, [orders]);

  return (
    <div className="product-by-gender-container">
      <div className="graph-header">
        <h3>Product Orders by Gender</h3>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" allowDecimals={false}>
            <Label value="Quantity Sold" offset={0} position="insideBottom" />
          </XAxis>
          <YAxis 
            type="category" 
            dataKey="product" 
            width={150}
            tick={{ fontSize: 14, fontWeight: 500, dy: 6 }}
            interval={0} 
          />
          <Tooltip />
          <Legend />
          <Bar dataKey="Male" stackId="a" fill="#007bff" />
          <Bar dataKey="Female" stackId="a" fill="#e83e8c" />
          <Bar dataKey="Unknown" stackId="a" fill="#6c757d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProductByGender;
