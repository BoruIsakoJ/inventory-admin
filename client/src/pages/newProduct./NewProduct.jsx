import './newProduct.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function NewProduct() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity_in_stock: '',
    category_id: '',
    supplier_id: ''
  });

  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    fetch('/categories', { credentials: 'include' })
      .then(res => res.json())
      .then(setCategories);

    fetch('/suppliers', { credentials: 'include' })
      .then(res => res.json())
      .then(setSuppliers);
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'quantity_in_stock' ? parseFloat(value) || 0 : value
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    fetch('/products', {
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
        alert("Product created successfully!");
        navigate('/dashboard/products');
      })
      .catch(async err => {
        const error = await err.json();
        alert(error.error || 'Failed to create product');
        console.error(error);
      });
  }

  return (
    <div className="newProduct">
      <h1 className="fw-bold mb-3">New Product</h1>
      <form className="newProductForm" onSubmit={handleSubmit}>
        <div className="newProductItem">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            placeholder="Enter product name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="newProductItem">
          <label>Price:</label>
          <input
            type="number"
            name="price"
            min="0"
            placeholder="Enter price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="newProductItem">
          <label>Stock:</label>
          <input
            type="number"
            name="quantity_in_stock"
            min="0"
            placeholder="Enter stock quantity"
            value={formData.quantity_in_stock}
            onChange={handleChange}
            required
          />
        </div>
        <div className="newProductItem">
          <label>Category:</label>
          <select
            name="category_id"
            className="newProductInput"
            value={formData.category_id}
            onChange={handleChange}
            required
          >
            <option value="" disabled>-- Select Category --</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div className="newProductItem">
          <label>Supplier:</label>
          <select
            name="supplier_id"
            className="newProductInput"
            value={formData.supplier_id}
            onChange={handleChange}
            required
          >
            <option value="" disabled>-- Select Supplier --</option>
            {suppliers.map(sup => (
              <option key={sup.id} value={sup.id}>{sup.name}</option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary mt-3">Create</button>
      </form>
    </div>
  );
}

export default NewProduct;
