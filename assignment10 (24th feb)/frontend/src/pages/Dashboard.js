import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

function Dashboard() {

    useEffect(() => {

        const token = localStorage.getItem("token");

        if (!token) {
            window.location.href = "/login";
        }

    }, []);

    //to get analytic data from django
    const [data, setData] = useState({});
    const [role, setRole] = useState("");

    //call django api when dashboard is loaded
    useEffect(() => {
        const token = localStorage.getItem("token");

        fetch("http://127.0.0.1:8000/api/dashboard/", {

            //send token for auth
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => setData(data));

        //user role api
        fetch("http://127.0.0.1:8000/api/user/", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

            .then(res => res.json())
            .then(data => setRole(data.role));

    }, []);

    return (

        <div className="d-flex">
            <Sidebar role={role} />
            <div className="container mt-5">

                <h2 className="mb-4">Analytics dashboard</h2>

                <div className="row">

                    {/*revenue card*/}
                    <div className="col-md-3">
                        <div className="card bg-success text-white shadow">
                            <div className="card-body">
                                <h5>Revenue</h5>
                                <h3>₹ {data.revenue?.toLocaleString()}</h3>
                            </div>
                        </div>
                    </div>

                    {/*orders card*/}
                    <div className="col-md-3">
                        <div className="card bg-primary text-white shadow">
                            <div className="card-body">
                                <h5>Orders</h5>
                                <h3>{data.orders}</h3>
                            </div>
                        </div>
                    </div>

                    {/*customers card*/}
                    <div className="col-md-3">
                        <div className="card bg-warning text-dark shadow">
                            <div className="card-body">
                                <h5>Customers</h5>
                                <h3>{data.customers}</h3>
                            </div>
                        </div>
                    </div>

                    {/*avg order value*/}
                    <div className="col-md-3">
                        <div className="card bg-dark text-white shadow">
                            <div className="card-body">
                                <h5>Avg Order Value</h5>
                                <h3>₹ {data.aov ? Math.round(data.aov).toLocaleString() : 0}</h3>
                            </div>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    )
}

export default Dashboard;