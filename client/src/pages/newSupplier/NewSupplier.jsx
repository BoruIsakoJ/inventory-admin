import './newSupplier.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function NewSupplier() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    fetch('/suppliers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(formData)
    })
      .then(res => {
        if (!res.ok) throw res;
        return res.json();
      })
      .then(() => {
        alert("Supplier created successfully!");
        navigate('/dashboard/suppliers');
      })
      .catch(async err => {
        const error = await err.json();
        alert(error.error || 'Failed to create supplier');
        console.error(error);
      });
  }

  return (
    <div className="newSupplier">
      <h1 className="fw-bold mb-3">New Supplier</h1>
      <form className="newSupplierForm" onSubmit={handleSubmit}>
        <div className="newSupplierItem">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            placeholder="Enter supplier name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="newSupplierItem">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            placeholder="Enter email address"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="newSupplierItem">
          <label>Phone:</label>
          <input
            type="tel"
            name="phone"
            placeholder="Enter phone number"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <div className="newSupplierItem">
          <label>Address:</label>
          <input
            type="text"
            name="address"
            placeholder="Enter address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary mt-3">Create</button>
      </form>
    </div>
  );
}

export default NewSupplier;
