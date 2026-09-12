import React, { useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';
export default function Register() {

    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        address: '',
        role: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const response = await api.post('/auth/user/register', user);
            console.log(response.data);
            alert('User registered successfully');
            setUser({
                name: '',
                email: '',
                password: '',
                address: '',
                role: ''
            });
        } catch (error) {
            console.error('Error registering user:', error);
            alert('Error registering user');
        }
    };

    return (
        <div className="register-page">

            <div className="register-container">

                <h1>RateMyStore</h1>
                <h2 style={{ marginTop: '20px' }}>Register</h2>

                <form
                    className="register-form"
                    onSubmit={handleSubmit}
                >

                    <input
                        type="text"
                        placeholder="Name"
                        name="name"
                        value={user.name}
                        onChange={(e) =>
                            setUser({
                                ...user,
                                name: e.target.value
                            })
                        }
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={user.email}
                        onChange={(e) =>
                            setUser({
                                ...user,
                                email: e.target.value
                            })
                        }
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={user.password}
                        onChange={(e) =>
                            setUser({
                                ...user,
                                password: e.target.value
                            })
                        }
                    />

                    <input
                        type="text"
                        placeholder="Address"
                        name="address"
                        value={user.address}
                        onChange={(e) =>
                            setUser({
                                ...user,
                                address: e.target.value
                            })
                        }
                    />

                    <select
                        name="role"
                        value={user.role}
                        onChange={(e) =>
                            setUser({
                                ...user,
                                role: e.target.value
                            })
                        }
                    >
                        <option value="">Select Role</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="USER">USER</option>
                        <option value="STORE_OWNER">
                            STORE OWNER
                        </option>
                    </select>

                    <button type="submit">
                        Register
                    </button>
                   <p>Already have an account? <Link to="/">Login here</Link></p>
                </form>

            </div>

        </div>
    );
}