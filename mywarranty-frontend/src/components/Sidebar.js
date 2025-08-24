
// import React from 'react';
import React, { forwardRef } from 'react';
import { Sidebar, Menu, MenuItem, SubMenu, useProSidebar } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';
import { FaTachometerAlt, FaPlus, FaCalendarTimes, FaFileInvoice, FaCog, FaUser, FaSignOutAlt, FaShieldAlt } from 'react-icons/fa';
// import { jwtDecode } from "jwt-decode";
import jwtDecode from "jwt-decode";
import { FaCloudUploadAlt } from "react-icons/fa";
// import { Link } from "react-router-dom";

// wrapper so MenuItem can use it safely
// const RouterLink = forwardRef(({ to, ...rest }, ref) => (
//   <Link ref={ref} to={to} {...rest} />
// ));

const SidebarComponent = () => {
  const { collapsed } = useProSidebar();
  const token = localStorage.getItem("token");

  // Decode token if exists
  let user = null;
  if (token) {
    try {
    //   user = jwtDecode(token); // now user contains { id, role, ... }
    // } catch (err) {
    //   console.error("Invalid token", err);
    // }
    user = JSON.parse(localStorage.getItem("user"));
} catch (err) {
  console.error("Error parsing user from localStorage", err);
}
  }

  return (
    <Sidebar collapsed={collapsed}>
      <div style={{ padding: '20px', textTransform: 'uppercase', fontWeight: 'bold', fontSize: 14, letterSpacing: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        <FaShieldAlt size={20} style={{ marginRight: '10px', color: '#007bff' }} />
        Warranty & Bill Manager
      </div>
      <Menu iconShape="square">
        {user?.role === "admin" ? (
          <>
            <MenuItem icon={<FaTachometerAlt />} component={<Link to="/admin-dashboard" />}>Dashboard</MenuItem>
            <MenuItem icon={<FaUser />} component={<Link to="/admin/users" />}>User Management</MenuItem>
            <MenuItem icon={<FaFileInvoice />} component={<Link to="/admin/bills" />}>All Bills</MenuItem>
            <MenuItem icon={<FaCalendarTimes />} component={<Link to="/admin/warranties" />}>All Warranties</MenuItem>
            <MenuItem icon={<FaCog />} component={<Link to="/admin/settings" />}>Settings</MenuItem>
          </>
        ) : (
          <>
            <MenuItem icon={<FaTachometerAlt />} component={<Link to="/dashboard" />}>Dashboard</MenuItem>
            <MenuItem icon={<FaPlus />} component={<Link to="/add-warranty" />}>Add Warranty</MenuItem>
            <MenuItem icon={<FaCalendarTimes />} component={<Link to="/expired-warranties" />}>Expired Warranties</MenuItem>
            
            <MenuItem icon={<FaCog />} component={<Link to="/settings" />}>Settings</MenuItem>
          </>
        )}
        
      </Menu>

      <div style={{ padding: '20px', borderTop: '1px solid #eee' }}>
        <div className="d-flex align-items-center mb-2">
          <FaUser size={20} style={{ marginRight: '10px', color: '#007bff' }} />
          <div>
            <h5>{user ? `${user.firstName} ${user.lastName}` : "Guest"}</h5>
            <p className="text-muted mb-0">
              {user?.role === "admin" ? "Admin" : "User"} —{" "}
              {user?.isPremium ? "Premium Customer" : "Free Customer"}
            </p>
          </div>
        </div>
        <div className="text-center">
          <small className="text-muted">© 2024 MyWarranty</small>
        </div>
      </div>
    </Sidebar>
  );
};

export default SidebarComponent;
