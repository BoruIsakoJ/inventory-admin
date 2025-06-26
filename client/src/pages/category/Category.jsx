import "./category.css";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function Category() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categoryData, setCategoryData] = useState({ name: "" });
  const [formData, setFormData] = useState({ name: "" });

  useEffect(() => {
    fetch(`/categories/${id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setCategoryData(data);
        setFormData({ name: data.name });
      })
      .catch((err) => {
        console.error("Failed to fetch category", err);
        alert("Category not found");
      });
  }, [id]);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    fetch(`/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Update failed");
        return res.json();
      })
      .then(() => {
        alert("Category updated successfully");
        navigate("/dashboard/categories");
      })
      .catch((err) => {
        alert("Update failed");
        console.error(err);
      });
  }

  return (
    <div className="category">
      <div className="d-flex justify-content-between align-items-center">
        <h1 className="categoryTitle fw-bold">Edit Category</h1>
      </div>
      <div className="categoryContainer">
        <div className="categoryShow">
          <div className="categoryShowTopTitle">
            <span className="categoryShowName fw-bold">{categoryData.name}</span>
          </div>
          <div className="categoryShowBottom">
            <span className="categoryShowTitle">Category Info</span>
            <div className="categoryShowInfo">
              <span className="categoryShowInfoLabel">Name:</span>
              <span className="categoryShowInfoValue">{categoryData.name}</span>
            </div>
          </div>
        </div>

        <div className="categoryUpdate">
          <span className="categoryUpdateTitle">Edit</span>
          <form className="categoryUpdateForm" onSubmit={handleSubmit}>
            <div className="categoryUpdateItem">
              <label>Category Name:</label>
              <input
                type="text"
                name="name"
                placeholder={formData.name}
                onChange={handleChange}
                className="categoryUpdateInput"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary mt-3">Update</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Category;
