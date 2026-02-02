import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend
} from "recharts";

import "./AdminReports.css"

const AdminReports = () => {
  const [topProducts, setTopProducts] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/top-products")
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(item => ({
          name: item.name, // deja vine direct
          total_sales: parseInt(item.total_sales)
        }));

        setTopProducts(formatted);
      })
      .catch(err => console.error("Eroare top produse:", err));

    fetch("http://localhost:8080/api/monthly-sales")
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(item => ({
          month: item.month,
          total_rentals: parseInt(item.total_rentals)
        }));
        setMonthlySales(formatted);
      })
      .catch(err => console.error("Eroare vânzări lunare:", err));
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
<div className="reports-container">
  {/* Grafic 1 */}
  <div className="chart-box">
    <h4 className="chart-title">Top 10 Produse Închiriate</h4>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={topProducts}>
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis />
        <Tooltip />
        <Bar dataKey="total_sales" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  </div>

  {/* Grafic 2 */}
  <div className="chart-box">
    <h4 className="chart-title">Închirieri pe Lună</h4>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={monthlySales}>
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="total_rentals" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  </div>
</div>
    </div>
  );
};

export default AdminReports;
