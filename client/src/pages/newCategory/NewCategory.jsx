import { useNavigate } from 'react-router-dom';
import './newCategory.css';
import { useState } from 'react';

function NewCategory() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: ''
  });

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    fetch('/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(formData)
    })
      .then(res => {
        if (!res.ok) throw res;
        return res.json();
      })
      .then(() => {
        alert('Category created successfully');
        navigate('/dashboard/categories');
      })
      .catch(async err => {
        const error = await err.json();
        alert(error.error || 'Failed to create category');
        console.error(error);
      });
  }

  return (
    <div className='newCategory'>
      <h1 className='fw-bold mb-3'>New Category</h1>
      <form className="newCategoryForm" onSubmit={handleSubmit}>
        <div className="newCategoryItem">
          <label>Category Name:</label>
          <input
            type='text'
            name='name'
            placeholder='Enter category name'
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">Create</button>
      </form>
    </div>
  );
}

export default NewCategory;
