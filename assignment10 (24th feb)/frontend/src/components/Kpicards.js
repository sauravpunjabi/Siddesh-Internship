import { useEffect, useState } from "react";
import api from "../services/api";

function KpiCards() {

    const [data, setData] = useState(null);

    useEffect(() => {
        api.get("dashboard/")
            .then((res) => setData(res.data))
            .catch((err) => console.log(err));
    }, []);

    if (!data) {
        return <p>Loading analytics...</p>;
    }

    return (
        <div className="row">

            {/* Revenue */}
            <div className="col-md-3">
                <div className="card shadow-sm p-3">
                    <h6>Total Revenue</h6>
                    <h4>₹ {Math.round(data.revenue)}</h4>
                </div>
            </div>

            {/* Orders */}
            <div className="col-md-3">
                <div className="card shadow-sm p-3">
                    <h6>Total Orders</h6>
                    <h4>{data.orders}</h4>
                </div>
            </div>

            {/* Customers */}
            <div className="col-md-3">
                <div className="card shadow-sm p-3">
                    <h6>Total Customers</h6>
                    <h4>{data.customers}</h4>
                </div>
            </div>

            {/* AOV */}
            <div className="col-md-3">
                <div className="card shadow-sm p-3">
                    <h6>Avg Order Value</h6>
                    <h4>₹ {Math.round(data.aov)}</h4>
                </div>
            </div>

        </div>
    );
}

export default KpiCards;