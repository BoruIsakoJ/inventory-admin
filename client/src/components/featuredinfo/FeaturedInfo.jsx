import "./featuredInfo.css";
import { useEffect, useState } from "react";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CategoryIcon from "@mui/icons-material/Category";

function FeaturedInfo() {
  const [productCount, setProductCount] = useState(0);
  const [supplierCount, setSupplierCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);

  useEffect(() => {
    fetch("/products", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setProductCount(data.length));

    fetch("/suppliers", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setSupplierCount(data.length));

    fetch("/categories", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setCategoryCount(data.length));
  }, []);

  return (
    <div className="featured">
      <div className="featuredItem">
        <span className="featuredTitle">Products</span>
        <div className="featuredIconContainer">
          <InventoryIcon className="featuredIcon" />
        </div>
        <span className="featuredData">{productCount}</span>
        <span className="featuredSub">Total products available</span>
      </div>

      <div className="featuredItem">
        <span className="featuredTitle">Suppliers</span>
        <div className="featuredIconContainer">
          <LocalShippingIcon className="featuredIcon" />
        </div>
        <span className="featuredData">{supplierCount}</span>
        <span className="featuredSub">Registered suppliers</span>
      </div>

      <div className="featuredItem">
        <span className="featuredTitle">Categories</span>
        <div className="featuredIconContainer">
          <CategoryIcon className="featuredIcon" />
        </div>
        <span className="featuredData">{categoryCount}</span>
        <span className="featuredSub">Product categories</span>
      </div>
    </div>
  );
}

export default FeaturedInfo;
