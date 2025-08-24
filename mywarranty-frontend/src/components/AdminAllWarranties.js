import React, { useEffect, useState } from "react";
import axios from "axios";
import authHeader from "../services/authHeader";
import { Table, Container } from 'react-bootstrap';

const AdminAllWarranties = () => {
  const [warranties, setWarranties] = useState([]);

  useEffect(() => {
    const fetchAllWarranties = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/warranties", authHeader());
        setWarranties(res.data);
      } catch (err) {
        console.error("Error fetching all warranties:", err);
      }
    };
    fetchAllWarranties();
  }, []);

  return (
    <Container fluid className="p-4">
      <h1 className="mb-4">All Warranties</h1>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h2 className="h6 m-0 font-weight-bold text-primary">All Warranties</h2>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Purchase Date</th>
                  <th>Expiry Date</th>
                  <th>User Email</th>
                </tr>
              </thead>
              <tbody>
                {warranties.map((warranty) => (
                  <tr key={warranty._id}>
                    <td>{warranty.productName}</td>
                    <td>{new Date(warranty.purchaseDate).toLocaleDateString()}</td>
                    <td>{new Date(warranty.expiryDate).toLocaleDateString()}</td>
                    <td>{warranty.user ? warranty.user.email : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default AdminAllWarranties;
