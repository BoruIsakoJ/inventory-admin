import "./chart.css"
import { BarChart, Bar,Rectangle, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';


import { useEffect, useState } from "react";

function Chart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/products", { credentials: "include" })
      .then((res) => res.json())
      .then((products) => {
        const formatted = products.map((product) => ({
          name: product.name,
          quantity: product.quantity_in_stock,
        }));
        setData(formatted);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      });
  }, []);

  return (
    <div className="chart">
      <h3 className="chartTitle">Stock per Product</h3>
      <ResponsiveContainer width="100%" aspect={4 / 1.2}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="quantity"
            fill="orange"
            activeBar={<Rectangle fill="orangered" />}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Chart;