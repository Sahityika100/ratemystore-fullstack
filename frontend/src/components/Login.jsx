import React,{useState} from 'react'
import api from '../api';
import { useNavigate,Link } from 'react-router-dom';
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/user/login', {
                email: email,
                password: password
            });
            alert('User logged in successfully');
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            if (response.data.user.role === 'STORE_OWNER') {
                navigate('/store');
            } else if (response.data.user.role === 'ADMIN') {
                navigate('/admin/dashboard');
            } else {
                navigate('/user/dashboard');
            }
        } catch (error) {
            console.error('Error logging in user:', error);
            alert('Error logging in user');
        }
    };

    return (

        <div className="register-page">

            <div className="register-container">

                <h1>RateMyStore</h1>
                <h2 style={{ marginTop: '20px' }}>Login</h2>

                <form
                    className="register-form" onSubmit={handleSubmit}
                >
                    <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    /><br></br>
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    /><br></br>
                    <button type="submit">
                        Login
                    </button>

                </form>
                <p>Don't have an account? <Link to="/register">Register here</Link></p>
            </div>

        </div>
  )
}

export default Login
