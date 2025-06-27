import "./supplierList.css";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import Paper from "@mui/material/Paper";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function SupplierList({currentUser}) {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    fetch("/suppliers", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setSuppliers(data));
  }, []);

  const handleDelete = (id) => {
    fetch(`/suppliers/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          setSuppliers((prev) => prev.filter((sup) => sup.id !== id));
        } else {
          res.json().then((data) => {
            alert(data.error || "Delete failed");
          });
        }
      })
      .catch((err) => {
        console.error("Delete error:", err);
      });
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "phone", headerName: "Phone", width: 150 },
    { field: "address", headerName: "Address", width: 150 },
    {
      field: "action",
      headerName: "Action",
      width: 180,
      renderCell: (params) => {
        if (!currentUser || currentUser.user_role !== "admin") return null;
        return (
          <div className="supplierListButtons">
            <Link to={`/dashboard/suppliers/${params.row.id}`} className="text-decoration-none">
              <div className="supplierListEdit">
                <EditIcon /> Edit
              </div>
            </Link>
            <button
              className="supplierListDelete"
              onClick={() => handleDelete(params.row.id)}
            >
              <DeleteIcon /> Delete
            </button>
          </div>
        );
      },
    },
  ]

  return (
    <>
      {currentUser?.user_role === "admin" && (
        <Link to="/dashboard/newSupplier" className="d-flex justify-content-end mb-3">
          <button className="btn btn-success mb-4">Create</button>
        </Link>
      )}
      <Paper sx={{ width: "100%" }}>
        <DataGrid
          rows={suppliers}
          columns={columns}
          disableRowSelectionOnClick
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          sx={{ border: 0 }}
        />
      </Paper>
    </>
  );
}

export default SupplierList;
