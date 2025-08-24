
// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Card, Table, Button } from 'react-bootstrap';
// import { FaEdit, FaTrash } from 'react-icons/fa';
// import warrantyService from '../services/warrantyService';

// const Dashboard = () => {
//     const [activeWarranties, setActiveWarranties] = useState([]);
//     const [upcomingExpires, setUpcomingExpires] = useState([]);

//     useEffect(() => {
//         const fetchWarranties = async () => {
//             try {
//                 const allWarranties = await warrantyService.getWarranties();
//                 const today = new Date();

//                 const active = allWarranties.filter(
//                     (warranty) => new Date(warranty.expiryDate) >= today
//                 );
//                 setActiveWarranties(active);

//                 // Filter for upcoming expires (e.g., within 90 days, adjust as needed)
//                 const upcoming = active.filter(
//                     (warranty) => {
//                         const expiryDate = new Date(warranty.expiryDate);
//                         const diffTime = expiryDate.getTime() - today.getTime();
//                         const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//                         return diffDays <= 90 && diffDays >= 0; // Within 90 days and not expired
//                     }
//                 );
//                 setUpcomingExpires(upcoming);

//             } catch (error) {
//                 console.error('Error fetching warranties:', error);
//             }
//         };
//         fetchWarranties();
//     }, []);

//     const calculateDaysLeft = (expiryDate) => {
//         const today = new Date();
//         const expDate = new Date(expiryDate);
//         const diffTime = expDate.getTime() - today.getTime();
//         const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//         return diffDays > 0 ? diffDays : 0; // Return 0 if already expired
//     };

//     return (
//         <Container fluid className="p-3">
//             {/* <h1 className="mb-4">Dashboard</h1> */}
//             <Row className="mb-4">
//                 <Col md={12}>
//                     <Card className="shadow-sm">
//                         <Card.Body>
//                             <h4 className="mb-3">Upcoming Expires</h4>
//                             {upcomingExpires.length > 0 ? (
//                                 <ul>
//                                     {upcomingExpires.map((warranty) => (
//                                         <li key={warranty._id}>
//                                             {warranty.productName} expires in {calculateDaysLeft(warranty.expiryDate)} days.
//                                         </li>
//                                     ))}
//                                 </ul>
//                             ) : (
//                                 <p className="text-muted">No warranties expiring soon</p>
//                             )}
//                         </Card.Body>
//                     </Card>
//                 </Col>
//             </Row>
//             <Row>
//                 <Col md={8} className="mb-3">
//                     <Card className="shadow-sm">
//                         <Card.Body>
//                             <h4 className="mb-3">Active Warranties</h4>
//                             {activeWarranties.length > 0 ? (
//                                 <Table responsive hover className="mb-0">
//                                     <thead>
//                                         <tr>
//                                             <th>Product</th>
//                                             <th>Expiry Date</th>
//                                             <th>Days Left</th>
//                                             <th>Store</th>
//                                             <th>Actions</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {activeWarranties.map((warranty) => (
//                                             <tr key={warranty._id}>
//                                                 <td>{warranty.productName}</td>
//                                                 <td>{new Date(warranty.expiryDate).toLocaleDateString()}</td>
//                                                 <td><span className="badge bg-success">{calculateDaysLeft(warranty.expiryDate)} days</span></td>
//                                                 <td>{warranty.storeName}</td>
//                                                 <td>
//                                                     <Button variant="outline-primary" size="sm" className="me-2">
//                                                         <FaEdit />
//                                                     </Button>
//                                                     <Button variant="outline-danger" size="sm">
//                                                         <FaTrash />
//                                                     </Button>
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </Table>
//                             ) : (
//                                 <p className="text-muted">No active warranties found</p>
//                             )}
//                         </Card.Body>
//                     </Card>
//                 </Col>
//                 <Col md={4} className="mb-3">
//                     <Card className="shadow-sm">
//                         <Card.Body>
//                             <h4 className="mb-3">Reminders</h4>
//                             <p className="text-muted">No urgent reminders</p>
//                             {/* Future: Add a list of reminders */}
//                         </Card.Body>
//                     </Card>
//                 </Col>
//             </Row>
//         </Container>
//     );
// };

// export default Dashboard;


import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import warrantyService from '../services/warrantyService';

const Dashboard = () => {
    const [activeWarranties, setActiveWarranties] = useState([]);
    const [upcomingExpires, setUpcomingExpires] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // ✅ Load user from localStorage
        const storedUser = JSON.parse(localStorage.getItem("user"));
        setUser(storedUser);

        const fetchWarranties = async () => {
            try {
                const allWarranties = await warrantyService.getWarranties();
                const today = new Date();

                const active = allWarranties.filter(
                    (warranty) => new Date(warranty.expiryDate) >= today
                );
                setActiveWarranties(active);

                const upcoming = active.filter((warranty) => {
                    const expiryDate = new Date(warranty.expiryDate);
                    const diffTime = expiryDate.getTime() - today.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    return diffDays <= 90 && diffDays >= 0;
                });
                setUpcomingExpires(upcoming);
            } catch (error) {
                console.error('Error fetching warranties:', error);
            }
        };
        fetchWarranties();
    }, []);

    const calculateDaysLeft = (expiryDate) => {
        const today = new Date();
        const expDate = new Date(expiryDate);
        const diffTime = expDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    return (
        <Container fluid className="p-3">
            {/* ✅ Show user info */}
            {/* <Row>
                <Col>
                    <h2>
                        {user ? `${user.firstName} ${user.lastName}` : "Guest"}
                    </h2>
                    <p>
                        {user?.role} — {user?.isPremium ? "Premium Customer" : "Free Customer"}
                    </p>
                </Col>
            </Row> */}

            <Row className="mb-4">
                <Col md={12}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <h4 className="mb-3">Upcoming Expires</h4>
                            {upcomingExpires.length > 0 ? (
                                <ul>
                                    {upcomingExpires.map((warranty) => (
                                        <li key={warranty._id}>
                                            {warranty.productName} expires in {calculateDaysLeft(warranty.expiryDate)} days.
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-muted">No warranties expiring soon</p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col md={8} className="mb-3">
                    <Card className="shadow-sm">
                        <Card.Body>
                            <h4 className="mb-3">Active Warranties</h4>
                            {activeWarranties.length > 0 ? (
                                <Table responsive hover className="mb-0">
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Expiry Date</th>
                                            <th>Days Left</th>
                                            <th>Store</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {activeWarranties.map((warranty) => (
                                            <tr key={warranty._id}>
                                                <td>{warranty.productName}</td>
                                                <td>{new Date(warranty.expiryDate).toLocaleDateString()}</td>
                                                <td><span className="badge bg-success">{calculateDaysLeft(warranty.expiryDate)} days</span></td>
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
                            ) : (
                                <p className="text-muted">No active warranties found</p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-3">
                    <Card className="shadow-sm">
                        <Card.Body>
                            <h4 className="mb-3">Reminders</h4>
                            <p className="text-muted">No urgent reminders</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Dashboard;
