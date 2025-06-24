import React from 'react'
import { Link } from 'react-router-dom'

function LandingPage() {
  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-5 shadow" style={{ maxWidth: "500px", width: "100%" }}>
        <h1 className="text-center mb-4">Welcome to this React Application</h1>
        <p className="text-center">
          <Link to="/login" className="btn btn-primary btn-lg mx-2">
            Login
          </Link>
          <Link to="/register" className="btn btn-success btn-lg mx-2">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LandingPage
