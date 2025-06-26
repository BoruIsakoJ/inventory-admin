import "./supplier.css";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BusinessIcon from "@mui/icons-material/Business";

function Supplier() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [supplierData, setSupplierData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    company: ""
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    company: ""
  });

  useEffect(() => {
    fetch(`/suppliers/${id}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setSupplierData({
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          company: data.company || "N/A"
        });

        setFormData({
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          company: data.company || ""
        });
      });
  }, [id]);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    fetch(`/suppliers/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(formData)
    })
      .then((res) => {
        if (!res.ok) throw res;
        return res.json();
      })
      .then(() => {
        alert("Supplier updated successfully");
        navigate("/dashboard/suppliers");
      })
      .catch(async (err) => {
        const error = await err.json();
        alert(error.error || "Failed to update supplier");
        console.error(error);
      });
  }

  return (
    <div className="supplier">
      <h1 className="supplierTitle">Edit Supplier</h1>
      <div className="supplierContainer">
        <div className="supplierShow">
          <div className="supplierShowTopTitle">
            <span className="supplierShowName">{supplierData.name}</span>
          </div>
          <div className="supplierShowDetails">
            <span className="supplierShowTitle">Supplier Details</span>

            <div className="supplierShowInfo">
              <strong><EmailIcon /></strong>
              <span className="supplierShowInfoText">{supplierData.email}</span>
            </div>

            <div className="supplierShowInfo">
              <strong><LocalPhoneIcon /></strong>
              <span className="supplierShowInfoText">{supplierData.phone}</span>
            </div>

            <div className="supplierShowInfo">
              <strong><LocationOnIcon /></strong>
              <span className="supplierShowInfoText">{supplierData.address}</span>
            </div>
          </div>
        </div>

        <div className="supplierUpdate">
          <span className="supplierUpdateTitle">Edit</span>
          <form className="supplierUpdateForm" onSubmit={handleSubmit}>
            <div className="supplierUpdateItem">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="supplierUpdateInput"
              />
            </div>
            <div className="supplierUpdateItem">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="supplierUpdateInput"
              />
            </div>
            <div className="supplierUpdateItem">
              <label>Phone:</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="supplierUpdateInput"
              />
            </div>
            <div className="supplierUpdateItem">
              <label>Address:</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="supplierUpdateInput"
              />
            </div>
            <button type="submit" className="btn btn-primary mt-3">Update</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Supplier;
