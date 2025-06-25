import Topbar from '../components/topbar/Topbar';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/sidebar/Sidebar';
import './dashboardLayout.css'


function DashboardLayout() {
  return (
    <>
      <Topbar />
      <div className="dashboard-container">
        <Sidebar />
        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default DashboardLayout; 