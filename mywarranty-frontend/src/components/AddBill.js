import React, { useState } from 'react';
import { Container, Form, Button, Card, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaUpload, FaShoppingCart, FaLaptop, FaTshirt, FaUtensils, FaCar, FaHome, FaTools, FaBuilding } from 'react-icons/fa';
import billService from '../services/billService'; // Import billService

const AddBill = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        billNumber: '',
        storeName: '',
        billDate: '',
        amount: '',
        category: '',
        paymentMethod: '',
        description: '',
        notes: '',
        // billImageUrl: '',
    });

    const { billNumber, storeName, billDate, amount, category, paymentMethod, description, notes } = formData;

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleCategorySelect = (selectedCategory) => {
        setFormData({ ...formData, category: selectedCategory });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await billService.addBill(formData);
            alert('Bill added successfully!');
            navigate('/dashboard');
        } catch (error) {
            console.error('Failed to add bill:', error.response.data.msg);
            alert(error.response.data.msg || 'Failed to add bill');
        }
    };

    return (
        <Container fluid className="p-3">
            {/* <h1 className="mb-4">Add Bill</h1> */}
            <Row>
                <Col md={12} className="mb-4">
                    <Card className="shadow-sm">
                        <Card.Body>
                            <h4 className="mb-3">Bill Details</h4>
                            <Form onSubmit={onSubmit}>
                                <Row>
                                    <Col md={6} className="mb-3">
                                        <Form.Group controlId="billNumber">
                                            <Form.Label>Bill Number *</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter bill number"
                                                name="billNumber"
                                                value={billNumber}
                                                onChange={onChange}
                                                required
                                                style={{ borderRadius: '5px', borderColor: '#ddd' }}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6} className="mb-3">
                                        <Form.Group controlId="storeName">
                                            <Form.Label>Store Name *</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter store name"
                                                name="storeName"
                                                value={storeName}
                                                onChange={onChange}
                                                required
                                                style={{ borderRadius: '5px', borderColor: '#ddd' }}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6} className="mb-3">
                                        <Form.Group controlId="billDate">
                                            <Form.Label>Bill Date *</Form.Label>
                                            <Form.Control
                                                type="date"
                                                name="billDate"
                                                value={billDate}
                                                onChange={onChange}
                                                required
                                                style={{ borderRadius: '5px', borderColor: '#ddd' }}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6} className="mb-3">
                                        <Form.Group controlId="amount">
                                            <Form.Label>Amount *</Form.Label>
                                            <div className="input-group">
                                                <span className="input-group-text" style={{ borderRadius: '5px 0 0 5px', borderColor: '#ddd', backgroundColor: '#e9ecef' }}>₹</span>
                                                <Form.Control
                                                    type="number"
                                                    placeholder="Enter amount"
                                                    name="amount"
                                                    value={amount}
                                                    onChange={onChange}
                                                    required
                                                    style={{ borderRadius: '0 5px 5px 0', borderColor: '#ddd' }}
                                                />
                                            </div>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6} className="mb-3">
                                        <Form.Group controlId="category">
                                            <Form.Label>Category *</Form.Label>
                                            <Form.Control
                                                as="select"
                                                name="category"
                                                value={category}
                                                onChange={onChange}
                                                required
                                                style={{ borderRadius: '5px', borderColor: '#ddd' }}
                                            >
                                                <option value="">Select Category</option>
                                                <option value="Groceries">Groceries</option>
                                                <option value="Electronics">Electronics</option>
                                                <option value="Clothing">Clothing</option>
                                                <option value="Food & Dining">Food & Dining</option>
                                                <option value="Automotive">Automotive</option>
                                                <option value="Home">Home</option>
                                                <option value="Utilities">Utilities</option>
                                                <option value="Other">Other</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6} className="mb-3">
                                        <Form.Group controlId="paymentMethod">
                                            <Form.Label>Payment Method *</Form.Label>
                                            <Form.Control
                                                as="select"
                                                name="paymentMethod"
                                                value={paymentMethod}
                                                onChange={onChange}
                                                required
                                                style={{ borderRadius: '5px', borderColor: '#ddd' }}
                                            >
                                                <option value="">Select Payment Method</option>
                                                <option value="Credit Card">Credit Card</option>
                                                <option value="Debit Card">Debit Card</option>
                                                <option value="Net Banking">Net Banking</option>
                                                <option value="UPI">UPI</option>
                                                <option value="Cash">Cash</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Form.Group controlId="description" className="mb-3">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Brief description of the purchase"
                                        name="description"
                                        value={description}
                                        onChange={onChange}
                                        style={{ borderRadius: '5px', borderColor: '#ddd' }}
                                    />
                                </Form.Group>
                                <Form.Group controlId="notes" className="mb-4">
                                    <Form.Label>Notes</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Additional notes or comments"
                                        name="notes"
                                        value={notes}
                                        onChange={onChange}
                                        style={{ borderRadius: '5px', borderColor: '#ddd' }}
                                    />
                                </Form.Group>
                                <div className="d-flex justify-content-center">
                                    <Button variant="primary" type="submit" className="w-auto mx-2" style={{ backgroundColor: '#007bff', borderColor: '#007bff', borderRadius: '5px' }}>
                                        Save Bill
                                    </Button>
                                    <Button variant="secondary" type="reset" className="w-auto mx-2" style={{ borderRadius: '5px' }}>
                                        Reset Form
                                    </Button>
                                    <Button variant="light" className="w-auto mx-2" onClick={() => navigate('/dashboard')} style={{ borderRadius: '5px', borderColor: '#ddd' }}>
                                        Back to Dashboard
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col md={12}>
                    <Card className="shadow-sm">
                        <Card.Body className="text-center">
                            <h4 className="mb-3">Upload Bill Image</h4>
                            <div
                                style={{
                                    border: '2px dashed #007bff',
                                    borderRadius: '10px',
                                    padding: '40px 20px',
                                    backgroundColor: '#eaf5ff',
                                    cursor: 'pointer',
                                    marginBottom: '20px',
                                }}
                            >
                                <FaUpload size={40} className="mb-3" style={{ color: '#007bff' }} />
                                <p className="mb-1">Click to upload or drag and drop</p>
                                <p className="text-muted mb-0">Upload bill image for automatic data extraction and storage</p>
                                <div className="mt-3">
                                    <span className="badge bg-light text-dark me-2" style={{ border: '1px solid #ddd' }}>JPG</span>
                                    <span className="badge bg-light text-dark me-2" style={{ border: '1px solid #ddd' }}>PNG</span>
                                    <span className="badge bg-light text-dark" style={{ border: '1px solid #ddd' }}>PDF</span>
                                </div>
                            </div>
                            {/* Hidden file input */}
                            <input type="file" style={{ display: 'none' }} id="billFileInput" />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col md={12}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <h4 className="mb-3">Select Bill Category</h4>
                            <Row className="g-3">
                                <Col xs={4} sm={3} md={2}>
                                    <Button variant="outline-primary" className="w-100 h-100 d-flex flex-column align-items-center justify-content-center py-3" onClick={() => handleCategorySelect('Groceries')} active={category === 'Groceries'}>
                                        <FaShoppingCart size={30} className="mb-2" />
                                        <span>Groceries</span>
                                    </Button>
                                </Col>
                                <Col xs={4} sm={3} md={2}>
                                    <Button variant="outline-primary" className="w-100 h-100 d-flex flex-column align-items-center justify-content-center py-3" onClick={() => handleCategorySelect('Electronics')} active={category === 'Electronics'}>
                                        <FaLaptop size={30} className="mb-2" />
                                        <span>Electronics</span>
                                    </Button>
                                </Col>
                                <Col xs={4} sm={3} md={2}>
                                    <Button variant="outline-primary" className="w-100 h-100 d-flex flex-column align-items-center justify-content-center py-3" onClick={() => handleCategorySelect('Clothing')} active={category === 'Clothing'}>
                                        <FaTshirt size={30} className="mb-2" />
                                        <span>Clothing</span>
                                    </Button>
                                </Col>
                                <Col xs={4} sm={3} md={2}>
                                    <Button variant="outline-primary" className="w-100 h-100 d-flex flex-column align-items-center justify-content-center py-3" onClick={() => handleCategorySelect('Food & Dining')} active={category === 'Food & Dining'}>
                                        <FaUtensils size={30} className="mb-2" />
                                        <span>Food & Dining</span>
                                    </Button>
                                </Col>
                                <Col xs={4} sm={3} md={2}>
                                    <Button variant="outline-primary" className="w-100 h-100 d-flex flex-column align-items-center justify-content-center py-3" onClick={() => handleCategorySelect('Automotive')} active={category === 'Automotive'}>
                                        <FaCar size={30} className="mb-2" />
                                        <span>Automotive</span>
                                    </Button>
                                </Col>
                                <Col xs={4} sm={3} md={2}>
                                    <Button variant="outline-primary" className="w-100 h-100 d-flex flex-column align-items-center justify-content-center py-3" onClick={() => handleCategorySelect('Home')} active={category === 'Home'}>
                                        <FaHome size={30} className="mb-2" />
                                        <span>Home</span>
                                    </Button>
                                </Col>
                                <Col xs={4} sm={3} md={2}>
                                    <Button variant="outline-primary" className="w-100 h-100 d-flex flex-column align-items-center justify-content-center py-3" onClick={() => handleCategorySelect('Utilities')} active={category === 'Utilities'}>
                                        <FaTools size={30} className="mb-2" />
                                        <span>Utilities</span>
                                    </Button>
                                </Col>
                                <Col xs={4} sm={3} md={2}>
                                    <Button variant="outline-primary" className="w-100 h-100 d-flex flex-column align-items-center justify-content-center py-3" onClick={() => handleCategorySelect('Other')} active={category === 'Other'}>
                                        <FaBuilding size={30} className="mb-2" /> {/* Using a generic icon for Other */}
                                        <span>Other</span>
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AddBill;
