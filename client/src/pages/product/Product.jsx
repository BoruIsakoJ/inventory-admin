import "./product.css";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; import CategoryIcon from '@mui/icons-material/Category';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

function Product() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [productData, setProductData] = useState({
        name: "",
        price: 0,
        quantity_in_stock: 0,
        category: "",
        supplier: ""
    });

    const [formData, setFormData] = useState({
        name: "",
        price: 0,
        quantity_in_stock: 0,
        category_id: "",
        supplier_id: ""
    });
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);


    useEffect(() => {

        fetch(`/products/${id}`, { credentials: "include" })
            .then(res => res.json())
            .then(data => {
                setProductData({
                    name: data.name,
                    price: data.price,
                    quantity_in_stock: data.quantity_in_stock,
                    category: data.category?.name || "N/A",
                    supplier: data.supplier?.name || "N/A"
                });

                setFormData({
                    name: data.name,
                    price: data.price,
                    quantity_in_stock: data.quantity_in_stock,
                    category_id: data.category_id,
                    supplier_id: data.supplier_id
                });
            });

        fetch('/categories', { credentials: 'include' })
            .then(res => res.json())
            .then(data => setCategories(data));

        fetch('/suppliers', { credentials: 'include' })
            .then(res => res.json())
            .then(data => setSuppliers(data));
    }, [id]);


    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    function handleSubmit(e) {
        e.preventDefault();

        fetch(`/products/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(formData)
        })
            .then(res => {
                if (!res.ok) throw res;
                return res.json();
            })
            .then(() => {
                alert("Product updated successfully");
                navigate("/dashboard/products");
            })
            .catch(async err => {
                const error = await err.json();
                alert(error.error || "Failed to update product");
                console.error(error);
            });
    }

    return (
        <div className="product">
            <h1 className="productTitle">Edit Product</h1>
            <div className="productContainer">
                <div className="productShow">
                    <div className="productShowTopTitle">
                        <span className="productShowName">{productData.name}</span>
                    </div>
                    <div className="productShowDetails">
                        <span className="productShowTitle">Product Details</span>
                        <div className="productShowInfo">
                            <strong><LocalOfferIcon /></strong>
                            <span className="productShowInfoText">Ksh. {productData.price}</span>
                        </div>
                        <div className="productShowInfo">
                            <strong><ShoppingCartIcon /></strong>
                            <span className="productShowInfoText">{productData.stock}</span>
                        </div>
                        <div className="productShowInfo">
                            <strong><CategoryIcon /></strong>
                            <span className="productShowInfoText">{productData.category}</span>
                        </div>
                        <div className="productShowInfo">
                            <strong><LocalShippingIcon /></strong>
                            <span className="productShowInfoText">{productData.supplier}</span>
                        </div>
                    </div>
                </div>

                <div className="productUpdate">
                    <span className="productUpdateTitle">Edit</span>
                    <form className="productUpdateForm" onSubmit={handleSubmit}>
                        <div className="productUpdateItem">
                            <label>Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                className="productUpdateInput"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="productUpdateItem">
                            <label>Price:</label>
                            <input
                                type="number"
                                name="price"
                                min={"1"}
                                value={formData.price}
                                className="productUpdateInput"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="productUpdateItem">
                            <label>Stock:</label>
                            <input
                                type="number"
                                name="quantity_in_stock"
                                min={"0"}
                                value={formData.quantity_in_stock}
                                className="productUpdateInput"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="productUpdateItem">
                            <label>Category:</label>
                            <select
                                name="category_id"
                                value={formData.category_id}
                                onChange={handleChange}
                                className="productUpdateInput"
                            >
                                <option value="" disabled>Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="productUpdateItem">
                            <label>Supplier:</label>
                            <select
                                name="supplier_id"
                                value={formData.supplier_id}
                                onChange={handleChange}
                                className="productUpdateInput"
                            >
                                <option value="" disabled>Select Supplier</option>
                                {suppliers.map((sup) => (
                                    <option key={sup.id} value={sup.id}>
                                        {sup.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button type="submit" className="btn btn-primary mt-3">Update</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Product;
