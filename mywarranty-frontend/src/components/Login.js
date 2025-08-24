
import React, { useState } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { FcGoogle } from 'react-icons/fc'; // Import Google icon

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { email, password } = formData;
    const navigate = useNavigate();

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await authService.login({ email, password });
            // await authService.login({ email, password });
            // Save token & user info in localStorage
if (res.token || res.accessToken) {
  localStorage.setItem("accessToken", res.token || res.accessToken);
}
if (res.refreshToken) {
  localStorage.setItem("refreshToken", res.refreshToken);
}
if (res.user) {
  localStorage.setItem("user", JSON.stringify(res.user));
}
            navigate('/dashboard'); // Redirect to dashboard after successful login
        } catch (error) {
            console.error('Login failed:', error.response.data.msg);
            alert(error.response.data.msg || 'Login failed');
        }
    };

    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }} // Added background color to match the image
        >
            <Card style={{ width: '28rem', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}> {/* Adjusted width and added styling */}
                <Card.Body className="p-4"> {/* Added padding */}
                    <h2 className="text-center mb-4" style={{ color: '#333' }}>Login</h2> {/* Adjusted color */}
                    <Form onSubmit={onSubmit}>
                        <Form.Group controlId="formBasicEmail" className="mb-3">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                name="email"
                                value={email}
                                onChange={onChange}
                                required
                                style={{ borderRadius: '5px', borderColor: '#ddd' }} // Added styling
                            />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword" className="mb-4"> {/* Increased margin-bottom */}
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                name="password"
                                value={password}
                                onChange={onChange}
                                required
                                style={{ borderRadius: '5px', borderColor: '#ddd' }} // Added styling
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100 mb-3" style={{ backgroundColor: '#007bff', borderColor: '#007bff', borderRadius: '5px' }}> {/* Styled button */}
                            Login
                        </Button>
                        <div className="d-flex align-items-center my-3">
                            <hr className="flex-grow-1" style={{ borderColor: '#ddd' }} />
                            <span className="mx-2 text-muted">or</span>
                            <hr className="flex-grow-1" style={{ borderColor: '#ddd' }} />
                        </div>
                        <Button variant="outline-dark" className="w-100 d-flex align-items-center justify-content-center" style={{ borderRadius: '5px' }}>
                            <FcGoogle size={20} className="me-2" /> Continue with Google
                        </Button>
                        <p className="text-center mt-3 mb-0"> {/* Adjusted margin-bottom */}
                            Don't have an account? <a href="/signup" style={{ textDecoration: 'none', color: '#007bff' }}>Sign Up</a>
                        </p>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Login;
