import React from 'react'
import './topbar.css'
import LogoutIcon from '@mui/icons-material/Logout';

function Topbar() {
  return (
    <div className='topbar'>
        <div className="topbarWrapper">
            <div className="topLeft">
                <span className="logo">Safi Admin</span>
            </div>
            <div className="topRight">
                <div className="topbarIcons">
                    <button className='btn btn-outline-secondary' ><LogoutIcon color="action"/></button> 
                </div>
            </div>
        </div>
    </div>
  )
}

export default Topbar