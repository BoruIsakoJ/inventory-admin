import "./userList.css"
import { useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import Paper from "@mui/material/Paper";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from "react-router-dom";



function UserList({currentUser}) {
  const [users, setUsers] = useState([]);

  function handleDelete(id) {
    fetch(`/users/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
      .then((res) => {
        if (res.ok) {
          setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
        } else {
          res.json().then(data => {
            console.error("Failed to delete user:", data.error);
          });
        }
      })
      .catch((err) => console.error("Request error:", err));
  }


  const columns = [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'name', headerName: 'Name', width: 130 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'user_role', headerName: 'User Role', width: 100, },
    {
      field: 'action',
      headerName: "Action",
      width: 180,
      renderCell: (params) => {
          if (!currentUser || currentUser.user_role !== 'admin') return null;
        return (
          <div className="userListButtons">
            <Link to={`/dashboard/user/${params.row.id}`} className="text-decoration-none">
              <div className="userListEdit">
                <EditIcon /> Edit
              </div>
            </Link>

            <button className="userListDelete" onClick={() => handleDelete(params.row.id)}>
              <DeleteIcon /> Delete
            </button>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    fetch("/users")
      .then((r) => r.json())
      .then((data) => {
        console.log("Fetched users:", data)
        setUsers(data);
      });
  }, []);



  return (
    <>
      {currentUser?.user_role === "admin" && (
        <Link to="/dashboard/newUser" className="d-flex justify-content-end mb-3">
          <button className="btn btn-success mb-4">Create</button>
        </Link>
      )}
      <Paper sx={{ width: '100%' }}>
        <DataGrid
          rows={users}
          columns={columns}
          disableRowSelectionOnClick
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 5 } }
          }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          sx={{ border: 0 }}
        />
      </Paper>
    </>
  );
}

export default UserList;
