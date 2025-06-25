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
                        <li className="sidebarListItem">
                            <Link to="/dashboard" className="sidebarLink">
                                <HomeIcon className="sidebarIcon" /> Home
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="sidebarMenu">
                    <h3 className="sidebarTitle">Quick Menu</h3>
                    <ul className="sidebarList">
                        <li className="sidebarListItem">
                            <Link to="/dashboard/categories">
                                <CategoryIcon className="sidebarIcon" />
                                Categories
                            </Link>
                        </li>

                        <li className="sidebarListItem">
                            <Link to="/dashboard/products">
                                <ShoppingCartIcon className="sidebarIcon" />
                                Products
                            </Link>
                        </li>

                        <li className="sidebarListItem">
                            <Link to="/dashboard/suppliers">
                                <LocalShippingIcon className="sidebarIcon" />
                                Suppliers
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="sidebarMenu">
                    <h3 className="sidebarTitle">Users</h3>
                    <ul className="sidebarList">
                        <li className="sidebarListItem">
                            <Link to="/dashboard/users">
                                <GroupIcon className="sidebarIcon" />
                                Users
                            </Link>
                        </li>
                    </ul>
                </div>

            </div>
        </div>
    );
}

export default Sidebar;
