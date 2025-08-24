import React, { useEffect, useState } from "react";
import axios from "axios";
import authHeader from "../services/authHeader";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/users", authHeader());
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/dashboard-stats", authHeader());
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    fetchUsers();
    fetchStats();
  }, []);

  return (
    <div className="container-fluid p-4">
      <h1 className="mb-4">Admin Dashboard</h1>

      {stats && (
        <div className="row mb-4">
          {/* Total Users Card */}
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <i className="fas fa-users fa-3x text-primary mb-3"></i>
                <h5 className="card-title">Total Users</h5>
                <p className="card-text display-4">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          {/* Premium Users Card */}
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <i className="fas fa-star fa-3x text-warning mb-3"></i>
                <h5 className="card-title">Premium Users</h5>
                <p className="card-text display-4">{stats.premiumUsers}</p>
              </div>
            </div>
          </div>

          {/* Total Warranties Card */}
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <i className="fas fa-file-alt fa-3x text-success mb-3"></i>
                <h5 className="card-title">Total Warranties</h5>
                <p className="card-text display-4">{stats.totalWarranties}</p>
              </div>
            </div>
          </div>

          {/* Total Bills Card */}
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <i className="fas fa-money-bill-wave fa-3x text-info mb-3"></i>
                <h5 className="card-title">Total Bills</h5>
                <p className="card-text display-4">{stats.totalBills}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
