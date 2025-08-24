import React, { useEffect, useState } from "react";
import axios from "axios";
import authHeader from "../services/authHeader";

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/users", authHeader());
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="container-fluid p-4">
      <h1 className="mb-4">User Management</h1>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h2 className="h6 m-0 font-weight-bold text-primary">All Users</h2>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered table-striped" id="usersTable" width="100%" cellSpacing="0">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Premium</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>{u.isPremium ? "✅" : "❌"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserManagement;
