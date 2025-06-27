import "./productList.css";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";

function ProductList({currentUser}) {
  const [products, setProducts] = useState([]);

  function handleDelete(id) {
    fetch(`/products/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          setProducts((prev) => prev.filter((product) => product.id !== id));
        } else {
          res.json().then((data) => {
            console.error("Failed to delete product:", data.error);
          });
        }
      })
      .catch((err) => console.error("Request error:", err));
  }

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "description", headerName: "Description", width: 150 },
    { field: "price", headerName: "Price", width: 100 },
    { field: "quantity_in_stock", headerName: "Stock", width: 100 },
    { field: "category", headerName: "Category", width: 130 },
    { field: "supplier", headerName: "Supplier", width: 130 },
    {
      field: "action",
      headerName: "Action",
      width: 180,
      renderCell: (params) => {
        if (!currentUser || currentUser.user_role !== "admin") return null
        return (
          <div className="productListButtons">
            <Link
              to={`/dashboard/products/${params.row.id}`}
              className="text-decoration-none"
            >
              <div className="productListEdit">
                <EditIcon /> Edit
              </div>
            </Link>
            <button
              className="productListDelete"
              onClick={() => handleDelete(params.row.id)}
            >
              <DeleteIcon /> Delete
            </button>
          </div>
        );
      },
    },
  ]

  useEffect(() => {
    fetch("/products", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        const transformed = data.map((product) => ({
          ...product,
          category: product.category?.name || "N/A",
          supplier: product.supplier?.name || "N/A",
        }));
        setProducts(transformed);
      });
  }, []);

  return (
    <>
      {currentUser?.user_role === "admin" && (
        <Link to="/dashboard/newProduct" className="d-flex justify-content-end mb-3">
          <button className="btn btn-success mb-4">Create</button>
        </Link>
      )}
      <Paper sx={{ width: "100%" }}>
        <DataGrid
          rows={products}
          columns={columns}
          disableRowSelectionOnClick
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 5 } },
          }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          sx={{ border: 0 }}
        />
      </Paper>
    </>
  );
}

export default ProductList;
