import React, { useEffect, useState } from "react";
import axios from "axios";
import authHeader from "../services/authHeader";
import { Table, Container } from 'react-bootstrap';

const AdminAllBills = () => {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    const fetchAllBills = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/bills", authHeader());
        setBills(res.data);
      } catch (err) {
        console.error("Error fetching all bills:", err);
      }
    };
    fetchAllBills();
  }, []);

  return (
    <Container fluid className="p-4">
      <h1 className="mb-4">All Bills</h1>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h2 className="h6 m-0 font-weight-bold text-primary">All Bills</h2>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Bill Number</th>
                  <th>Store Name</th>
                  <th>Bill Date</th>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>User Email</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill) => (
                  <tr key={bill._id}>
                    <td>{bill.billNumber}</td>
                    <td>{bill.storeName}</td>
                    <td>{new Date(bill.billDate).toLocaleDateString()}</td>
                    <td>₹{bill.amount}</td>
                    <td>{bill.category}</td>
                    <td>{bill.user ? bill.user.email : 'N/A'}</td>
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

export default AdminAllBills;
