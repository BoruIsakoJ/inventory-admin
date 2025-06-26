import './sidebar.css';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import GroupIcon from '@mui/icons-material/Group';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CategoryIcon from '@mui/icons-material/Category';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

function Sidebar() {
    return (
        <div className="sidebar">
            <div className="sidebarWrapper">

                <div className="sidebarMenu">
                    <h3 className="sidebarTitle">Dashboard</h3>
                    <ul className="sidebarList">
                        <Link to="/dashboard" className="sidebarListItem sidebarLink text-decoration-none">
                                <HomeIcon className="sidebarIcon" /> 
                                Home
                        </Link>
                    </ul>
                </div>

                <div className="sidebarMenu">
                    <h3 className="sidebarTitle">Quick Menu</h3>
                    <ul className="sidebarList">
                        <Link to="/dashboard/categories" className="sidebarListItem text-decoration-none">
                                <CategoryIcon className="sidebarIcon" />
                                Categories
                         </Link>

                        <Link to="/dashboard/products" className="sidebarListItem text-decoration-none">
                                <ShoppingCartIcon className="sidebarIcon" />
                                Products
                        </Link>

                        <Link to="/dashboard/suppliers" className="sidebarListItem text-decoration-none">
                                <LocalShippingIcon className="sidebarIcon" />
                                Suppliers
                        </Link>
                    </ul>
                </div>

                <div className="sidebarMenu">
                    <h3 className="sidebarTitle">Users</h3>
                    <ul className="sidebarList">
                        <Link to="/dashboard/users" className="sidebarListItem text-decoration-none">
                                <GroupIcon className="sidebarIcon" />
                                Users
                        </Link>
                    </ul>
                </div>

            </div>
        </div>
    );
}

export default Sidebar;
