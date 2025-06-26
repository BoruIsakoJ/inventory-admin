import React from 'react'
import './topbar.css'
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

function Topbar() {
  const navigate = useNavigate();

  function handleLogout() {
    fetch('/logout', {
      method: 'DELETE',
      credentials: 'include'
    })
      .then((res) => {
        if (res.ok) {
          navigate('/');
        } else {
          alert('Logout failed.');
        }
      })
      .catch((err) => {
        console.error("Logout error:", err);
        alert('An error occurred.');
      });
  }

  return (
    <div className='topbar'>
      <div className="d-flex justify-content-between align-items-center mx-3 my-1">
        <div className="topLeft">
          <span className="fw-bold text-primary fs-2">Safi Admin</span>
        </div>
        <div className="topRight">
          <div className="topbarIcons">
            <button className='btn btn-outline-secondary' onClick={handleLogout}>
              <LogoutIcon color="action" /> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


export default Topbar