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
import "./OrdersByRegionGraph.css";
import { compressedPincodeToCity } from "../../assets/pincodeToCity.js" // ✅ Your mapping file

const OrdersByRegionGraph = ({ orders }) => {
  const [regionData, setRegionData] = useState([]);

  useEffect(() => {
    const processOrders = () => {
      const pincodeMap = {};

      orders.forEach((order) => {
        const addressLine = order.address?.addressLine || "";

        // Match 6-digit pincode
        const pincodeMatch = addressLine.match(/\b\d{6}\b/);
        const pincode = pincodeMatch ? pincodeMatch[0] : "Unknown";

        if (pincode !== "Unknown") {
          if (pincodeMap[pincode]) {
            pincodeMap[pincode]++;
          } else {
            pincodeMap[pincode] = 1;
          }
        }
      });

      const regionArray = Object.entries(pincodeMap).map(([pincode, orders]) => {
        const pincodePrefix = pincode.slice(0, 4) + "00";
        const city = compressedPincodeToCity[pincodePrefix] || "Unknown City";
        return {
          region: `${pincode} (${city})`,
          orders,
        };
      });

      regionArray.sort((a, b) => b.orders - a.orders);
      const topRegions = regionArray.slice(0, 10);

      setRegionData(topRegions);
    };

    if (orders && orders.length > 0) {
      processOrders();
    }
  }, [orders]);

  return (
    <div className="orders-graph-container">
      <div className="graph-header">
        <h3>Orders by Region (Pincode)</h3>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          layout="vertical"
          data={regionData}
          margin={{ top: 20, right: 30, left: 10, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" allowDecimals={false}>
            <Label
              value="Number of Orders"
              position="insideBottom"
              offset={-10}
              style={{ textAnchor: "middle" }}
            />
          </XAxis>
          <YAxis
            type="category"
            dataKey="region"
            width={200}
            tick={{ fontSize: 14, fontWeight: 500, dy: 6 }}
            interval={0}
          />
          <Tooltip />
          <Bar dataKey="orders" fill="#f97316" barSize={22} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OrdersByRegionGraph;
