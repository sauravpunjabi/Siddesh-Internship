import { useEffect, useState } from "react";

function App() {

  const [data, setData] = useState({});

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/dashboard/")
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  return (
    <div>
      <h1>E-Commerce Dashboard</h1>
      <h2>Revenue: ₹ {data.revenue}</h2>
      <h2>Orders: {data.orders}</h2>
      <h2>Customers: {data.customers}</h2>
      <h2>Average Order Value: ₹ {data.aov}</h2>
    </div>
  );
}

export default App;