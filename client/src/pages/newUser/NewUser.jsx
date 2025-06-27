import { useNavigate } from 'react-router-dom'
import './newUser.css'
import { useState } from 'react'

function NewUser() {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        user_role_id: ''
    })

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    function handleSubmit(e) {
        e.preventDefault()
        fetch('/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(formData)
        })
            .then(res => {
                if (!res.ok) throw res
                return res.json()
            })
            .then(data => {
                alert('User created successfully')
                navigate('/dashboard/users')
            })
            .catch(async err => {
                const error = await err.json();
                alert(error.error || 'Failed to create user');
                console.error(error);
            });

    }



    return (
        <div className='newUser'>
            <h1 className='fw-bold mb-3'>New User</h1>
            <form className="newUserForm" onSubmit={handleSubmit}>
                <div className="newUserItem">
                    <label>Name: </label>
                    <input required type='text' name='name' placeholder='Enter your name' value={formData.name} onChange={handleChange} />
                </div>
                <div className="newUserItem">
                    <label>Email: </label>
                    <input required type='email' name='email' placeholder='Enter your email' value={formData.email} onChange={handleChange}/>
                </div>
                <div className="newUserItem">
                    <label>Password: </label>
                    <input required type='password' name='password' placeholder='Enter your password' value={formData.password} onChange={handleChange}/>
                </div>
                <div className="userUpdateItem">
                    <label>User Role:</label>
                    <select required name="user_role" className="userUpdateInput" value={formData.user_role_id} onChange={(e)=>{setFormData({...formData,user_role_id:parseInt(e.target.value)})}}>
                        <option value="" disabled>--Select User Role--</option>
                        <option value={1}>Admin</option>
                        <option value={2}>Local</option>
                    </select>
                    <button type="submit" className="btn btn-primary mt-3">Create</button>
                </div>
            </form>
        </div>
    )
}

export default NewUser