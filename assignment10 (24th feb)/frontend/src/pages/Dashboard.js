import KpiCards from "../components/Kpicards";
import DashboardCharts from "../components/DashboardCharts";

function Dashboard() {
    return (
        <div className="container mt-4">
            <h2 className="mb-4">Dashboard</h2>
            <KpiCards />
            <DashboardCharts />
        </div>
    );
}

export default Dashboard;