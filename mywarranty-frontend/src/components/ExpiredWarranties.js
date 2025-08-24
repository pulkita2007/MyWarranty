
import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import warrantyService from '../services/warrantyService';

const ExpiredWarranties = () => {
    const [expiredWarranties, setExpiredWarranties] = useState([]);

    useEffect(() => {
        const fetchExpiredWarranties = async () => {
            try {
                const data = await warrantyService.getExpiredWarranties();
                setExpiredWarranties(data);
            } catch (error) {
                console.error('Error fetching expired warranties:', error);
            }
        };
        fetchExpiredWarranties();
    }, []);

    const calculateDaysExpired = (expiryDate) => {
        const today = new Date();
        const expDate = new Date(expiryDate);
        const diffTime = today.getTime() - expDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0; // Return 0 if not yet expired
    };

    return (
        <Container fluid className="p-3">
            <h1 className="mb-4">Expired Warranties</h1>
            <Card className="shadow-sm">
                <Card.Body>
                    {expiredWarranties.length === 0 ? (
                        <p className="text-center text-muted mb-0">No expired warranties found!</p>
                    ) : (
                        <Table responsive hover className="mb-0">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Model</th>
                                    <th>Purchase Date</th>
                                    <th>Expiry Date</th>
                                    <th>Days Expired</th>
                                    <th>Store</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {expiredWarranties.map((warranty) => (
                                    <tr key={warranty._id}>
                                        <td>{warranty.productName}</td>
                                        <td>{warranty.model || 'N/A'}</td>
                                        <td>{new Date(warranty.purchaseDate).toLocaleDateString()}</td>
                                        <td>{new Date(warranty.expiryDate).toLocaleDateString()}</td>
                                        <td><span className="badge bg-danger">{calculateDaysExpired(warranty.expiryDate)} days</span></td>
                                        <td>{warranty.storeName}</td>
                                        <td>
                                            <Button variant="outline-primary" size="sm" className="me-2" onClick={() => console.log('Edit', warranty._id)}>
                                                <FaEdit />
                                            </Button>
                                            <Button variant="outline-danger" size="sm" onClick={() => console.log('Delete', warranty._id)}>
                                                <FaTrash />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ExpiredWarranties;
