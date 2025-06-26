import React from 'react'
import './topbar.css'
import LogoutIcon from '@mui/icons-material/Logout';

function Topbar() {
  return (
    <div className='topbar'>
        <div className="d-flex justify-content-between align-items-center mx-3 my-1">
            <div className="topLeft">
                <span className=" fw-bold text-primary fs-2">Safi Admin</span>
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