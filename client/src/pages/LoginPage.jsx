import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    function logInUser() {
        if (email.length === 0) {
            alert('Kindly fill in your email!')
        } else if (password.length === 0) {
            alert('Kindly fill in your password!')
        } else {
            fetch('/login', {
                method: 'POST',
                body: JSON.stringify({
                    "email": email,
                    "password": password
                }),
                headers: {
                    "Content-Type": 'application/json'
                },
                credentials: 'include'
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP status ${response.status}`);
                    }
                    return response.json()
                })
                .then((json) => {
                    console.log(json)
                    alert('Login successful!')
                    navigate('/dashboard')
                })
                .catch((error) => {
                    console.log(error)
                    alert('Invalid credentials or server error.')
                })
        }
    }

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="card p-4 shadow" style={{ maxWidth: "400px", width: "100%" }}>
                <h3 className="text-center mb-4">Login to Your Account</h3>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" placeholder="Enter your email" />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" placeholder="Enter your password" />
                </div>
                <button type="button" className="btn btn-primary w-100 mb-3" onClick={logInUser}>Login</button>
                <p className="text-center">Don't have an account? <a href="/register">Register</a></p>
            </div>
        </div>
    )
}

export default LoginPage
