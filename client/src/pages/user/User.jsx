import "./user.css";
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function User() {

  const { id } = useParams()
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    user_role: ''
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    user_role: ''
  });

  const navigate = useNavigate()

  useEffect(() => {
    fetch(`/users/${id}`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
      setUserData({
        name: data.name,
        email: data.email,
        user_role: data.user_role.toLowerCase()
      })
      setFormData({
        name: data.name,
        email: data.email,
        password: '',
        user_role: data.user_role_id
      })
    })
  }, [id])

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  function handleSubmit(e) {
    e.preventDefault()

    const payload = { ...formData };
    if (!payload.password) delete payload.password;

    fetch(`/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: "include",
      body: JSON.stringify(payload)
    })
      .then(data => {
        alert("User updated successfully")
        navigate("/dashboard/users")
      })
      .catch(err => {
        console.error(err);
        alert("Update failed");
      });


  }

  return (
    <div className="user">
      <div className="d-flex justify-content-between align-items-center">
        <h1 className="userTitle fw-bold">Edit User</h1>

      </div>
      <div className="userContainer">
        <div className="userShow">
          <div className="userShowTop">
            <div className="userShowTopTitle">
              <span className="userShowUsername fw-bold">{userData.name}</span>
              <span className="userShowUserRole">{userData.user_role}</span>
            </div>
          </div>
          <div className="userShowBottom">
            <span className="userShowTitle">Contact Details</span>
            <div className="userShowInfo">
              <PermIdentityIcon className="userShowInfoIcon" />
              <span className="userShowInfoTitle">{userData.email}</span>
            </div>


          </div>

        </div>
        <div className="userUpdate">
          <span className="userUpdateTitle">Edit</span>
          <form className="userUpdateForm" onSubmit={handleSubmit}>
            <div className="userUpdateItem">
              <label>Name:</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="userUpdateInput" />
            </div>
            <div className="userUpdateItem">
              <label>Email:</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="userUpdateInput" />
            </div>
            <div className="userUpdateItem">
              <label>Password:</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} className="userUpdateInput" />
            </div>
            <div className="userUpdateItem">
              <label>User Role:</label>
              <select name="user_role" className="userUpdateInput" value={formData.user_role} onChange={(e)=>{setFormData({...formData,user_role:parseInt(e.target.value)})}} >
                <option value="" disabled>--Select User Role--</option>
                <option value={1}>Admin</option>
                <option value={2}>Local</option>
              </select>
              <button type="submit" className="btn btn-primary mt-3">Update</button>

            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default User