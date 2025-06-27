import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <>
      <nav className="navbar shadow-sm d-flex justify-content-between">
        <div className="container">
          <Link className="navbar-brand fw-bold text-primary" to="/">InventoryPro</Link>
          <div >
            <Link to="/login" className="btn btn-primary me-2">Login</Link>
            <Link to="/register" className="btn btn-success">Register</Link>
          </div>
        </div>
      </nav>

      <div className="container-fluid d-flex align-items-center" style={{ height: '100vh' }}>
        <div className="container">
          <div className="row">

            <div className="col-md-6 d-flex flex-column justify-content-start" >
              <h1 className="display-3 fw-bold" style={{ marginTop: '-150px' }}>
                Manage your inventory <br /> with ease and efficiency.
              </h1>
              <p>
                Track stock levels, suppliers, categories, and users — all from one dashboard.
              </p>
            </div>

            <div className="col-md-6 d-flex flex-column justify-content-center" style={{ paddingRight: '3%', marginTop: "100px" }}>
              <p>
                <strong>Welcome to <span className="text-primary">InventoryPro</span></strong> your all-in-one inventory management platform.
                <br /><br />
                Streamlined. Secure. Smart.
              </p>
              <Link to="/login" className="btn btn-outline-primary btn-lg mt-3" style={{ width: '300px' }}>
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LandingPage;
