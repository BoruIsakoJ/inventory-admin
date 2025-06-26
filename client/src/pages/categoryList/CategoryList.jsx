import "./categoryList.css";
import { useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import Paper from "@mui/material/Paper";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from "react-router-dom";

function CategoryList() {
  const [categories, setCategories] = useState([]);

  function handleDelete(id) {
    fetch(`/categories/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
      .then((res) => {
        if (res.ok) {
          setCategories((prev) => prev.filter((category) => category.id !== id));
        } else {
          res.json().then(data => {
            console.error("Failed to delete category:", data.error);
          });
        }
      })
      .catch((err) => console.error("Request error:", err));
  }

  const columns = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'name', headerName: 'Category Name', width: 200 },
    {
      field: 'action',
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="userListButtons">
            <Link to={`/dashboard/categories/${params.row.id}`} className="text-decoration-none">
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
    fetch("/categories", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched categories:", data);
        setCategories(data);
      });
  }, []);

  return (
    <>
      <Link to="/dashboard/newCategory" className="d-flex justify-content-end mb-3">
        <button className="btn btn-success mb-4">Create</button>
      </Link>
      <Paper sx={{ width: '100%' }}>
        <DataGrid
          rows={categories}
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

export default CategoryList;
