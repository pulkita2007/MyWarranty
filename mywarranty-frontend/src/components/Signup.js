
import React, { useState } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { FcGoogle } from 'react-icons/fc'; // Import Google icon

const Signup = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        password2: '',
        phoneNumber: '',
    });

    const { firstName, lastName, email, password, password2, phoneNumber } = formData;
    const navigate = useNavigate();

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        if (password !== password2) {
            alert('Passwords do not match');
        } else {
            try {
                await authService.register({ firstName, lastName, email, password, phoneNumber });
                alert('Registration successful!');
                navigate('/login'); // Redirect to login after successful registration
            } 
            // catch (error) {
            //     console.error('Registration failed:', error.response.data.msg);
            //     alert(error.response.data.msg || 'Registration failed');
            // }
             catch (error) {
    console.error('Registration failed:', error);

    if (error.response && error.response.data && error.response.data.msg) {
        alert(error.response.data.msg);
    } else if (error.response && error.response.data) {
        alert(error.response.data);
    } else {
        alert('Registration failed. Please check backend/server connection.');
    }
}
        }
    };

    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }} // Added background color to match the image
        >
            <Card style={{ width: '28rem', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}> {/* Adjusted width and added styling */}
                <Card.Body className="p-4"> {/* Added padding */}
                    <h2 className="text-center mb-4" style={{ color: '#333' }}>Sign Up</h2> {/* Adjusted color */}
                    <Form onSubmit={onSubmit}>
                        <Form.Group controlId="formFirstName" className="mb-3">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter first name"
                                name="firstName"
                                value={firstName}
                                onChange={onChange}
                                required
                                style={{ borderRadius: '5px', borderColor: '#ddd' }} // Added styling
                            />
                        </Form.Group>

                        <Form.Group controlId="formLastName" className="mb-3">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter last name"
                                name="lastName"
                                value={lastName}
                                onChange={onChange}
                                required
                                style={{ borderRadius: '5px', borderColor: '#ddd' }} // Added styling
                            />
                        </Form.Group>

                        <Form.Group controlId="formEmail" className="mb-3">
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

                        <Form.Group controlId="formPassword" className="mb-3">
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

                        <Form.Group controlId="formPassword2" className="mb-4"> {/* Increased margin-bottom */}
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Confirm Password"
                                name="password2"
                                value={password2}
                                onChange={onChange}
                                required
                                style={{ borderRadius: '5px', borderColor: '#ddd' }} // Added styling
                            />
                        </Form.Group>

                        <Form.Group controlId="formPhoneNumber" className="mb-4"> {/* Increased margin-bottom */}
                            <Form.Label>Phone Number</Form.Label> {/* Removed optional text */}
                            <Form.Control
                                type="text"
                                placeholder="Enter phone number"
                                name="phoneNumber"
                                value={phoneNumber}
                                onChange={onChange}
                                style={{ borderRadius: '5px', borderColor: '#ddd' }} // Added styling
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100 mb-3" style={{ backgroundColor: '#007bff', borderColor: '#007bff', borderRadius: '5px' }}> {/* Styled button */}
                            Create Account
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
                            Already have an account? <a href="/login" style={{ textDecoration: 'none', color: '#007bff' }}>Login</a>
                        </p>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Signup;
