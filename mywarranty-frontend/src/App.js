// import React, { useState } from 'react';
// import { Routes, Route, useNavigate } from 'react-router-dom';
// import { ProSidebarProvider } from 'react-pro-sidebar';
// import './App.css';
// import Login from './components/Login';
// import Signup from './components/Signup';
// import Dashboard from './components/Dashboard';
// import SidebarComponent from './components/Sidebar'; // Use the renamed SidebarComponent
// import PrivateRoute from './components/PrivateRoute';
// import AddWarranty from './components/AddWarranty'; // Import AddWarranty
// import ExpiredWarranties from './components/ExpiredWarranties'; // Import ExpiredWarranties
// import Settings from './components/Settings'; // Import Settings
// import { FaShieldAlt } from 'react-icons/fa'; // Import shield icon

// function App() {
//     const [collapsed, setCollapsed] = useState(false);
//     const navigate = useNavigate();

//     // The toggleSidebar function is no longer directly used for the new sidebar API
//     // const toggleSidebar = () => {
//     //     setCollapsed(!collapsed);
//     // };

//     return (
//         <ProSidebarProvider>
//             <div className="d-flex" style={{ minHeight: '100vh' }}>
//                 {/* collapsed prop is not directly passed to Sidebar in v1+, managed by context */}
//                 <SidebarComponent /> 
//                 <main style={{ flexGrow: 1, padding: '20px', backgroundColor: '#f8f9fa' }}>
//                     <div className="d-flex justify-content-between align-items-center mb-4">
//                         <div className="d-flex align-items-center">
//                             <FaShieldAlt size={30} className="me-2" style={{ color: '#007bff' }} />
//                             <h3>Warranty & Bill Manager</h3>
//                         </div>
//                         <button className="btn btn-primary" onClick={() => navigate('/add-warranty')}>+ Add Warranty</button>
//                     </div>
//                     <Routes>
//                         <Route path="/login" element={<Login />} />
//                         <Route path="/signup" element={<Signup />} />
//                         <Route
//                             path="/dashboard"
//                             element={
//                                 <PrivateRoute>
//                                     <Dashboard />
//                                 </PrivateRoute>
//                             }
//                         />
//                         <Route
//                             path="/add-warranty"
//                             element={
//                                 <PrivateRoute>
//                                     <AddWarranty />
//                                 </PrivateRoute>
//                             }
//                         />
//                         <Route
//                             path="/expired-warranties"
//                             element={
//                                 <PrivateRoute>
//                                     <ExpiredWarranties />
//                                 </PrivateRoute>
//                             }
//                         />
//                         <Route
//                             path="/settings"
//                             element={
//                                 <PrivateRoute>
//                                     <Settings />
//                                 </PrivateRoute>
//                             }
//                         />
//                         {/* Add more routes here as we build out the application */}
//                     </Routes>
//                 </main>
//             </div>
//         </ProSidebarProvider>
//     );
// }

// export default App;

// import React from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import SidebarComponent from "./components/Sidebar";

// // Import your real pages
// import Dashboard from "./components/Dashboard";
// import AddWarranty from "./components/AddWarranty";
// import ExpiredWarranties from "./components/ExpiredWarranties";
// import AddBill from "./components/AddBill";
// import Settings from "./components/Settings";

// function App() {
//   return (
//     <Router>
//       <div style={{ display: "flex" }}>
//         {/* Sidebar on the left */}
//         <SidebarComponent />

//         {/* Page content on the right */}
//         <div style={{ flex: 1, padding: "20px" }}>
//           <Routes>
//             <Route path="/" element={<Navigate to="/dashboard" />} />
//             <Route path="/dashboard" element={<Dashboard />} />
//             <Route path="/add-warranty" element={<AddWarranty />} />
//             <Route path="/expired-warranties" element={<ExpiredWarranties />} />
//             <Route path="/add-bill" element={<AddBill />} />
//             <Route path="/settings" element={<Settings />} />
//           </Routes>
//         </div>
//       </div>
//     </Router>
//   );
// }

// export default App;

import React, { useState } from 'react';
import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { ProSidebarProvider } from 'react-pro-sidebar';
import './App.css';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import SidebarComponent from './components/Sidebar';
import PrivateRoute from './components/PrivateRoute';
import AddWarranty from './components/AddWarranty';
import ExpiredWarranties from './components/ExpiredWarranties';
import Settings from './components/Settings';
import { FaShieldAlt } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminDashboard from "./components/AdminDashboard";
import AdminUserManagement from "./components/AdminUserManagement";
import AdminAllBills from "./components/AdminAllBills";
import AdminAllWarranties from "./components/AdminAllWarranties";
import AdminSettings from "./components/AdminSettings";

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Sidebar & header should NOT appear on login/signup
  const hideLayout = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <ProSidebarProvider>
      <div className="d-flex" style={{ minHeight: '100vh' }}>
        {!hideLayout && <SidebarComponent />} 

        <main style={{ flexGrow: 1, padding: '20px', backgroundColor: '#f8f9fa' }}>
          {!hideLayout && (
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="d-flex align-items-center">
                <FaShieldAlt size={30} className="me-2" style={{ color: '#007bff' }} />
                <h3>Warranty & Bill Manager</h3>
              </div>
              <button className="btn btn-primary" onClick={() => navigate('/add-warranty')}>+ Add Warranty</button>
            </div>
          )}

          <Routes>
            {/* Default route redirects to login */}
            <Route path="/" element={<Navigate to="/login" />} />

            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected routes */}
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/add-warranty" element={<PrivateRoute><AddWarranty /></PrivateRoute>} />
            <Route path="/expired-warranties" element={<PrivateRoute><ExpiredWarranties /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
           <Route path="/admin-dashboard" element={<PrivateRoute adminOnly><AdminDashboard /></PrivateRoute>}/>
           <Route path="/admin/users" element={<PrivateRoute adminOnly><AdminUserManagement /></PrivateRoute>}/>
           <Route path="/admin/bills" element={<PrivateRoute adminOnly><AdminAllBills /></PrivateRoute>}/>
           <Route path="/admin/warranties" element={<PrivateRoute adminOnly><AdminAllWarranties /></PrivateRoute>}/>
           <Route path="/admin/settings" element={<PrivateRoute adminOnly><AdminSettings /></PrivateRoute>}/>
          </Routes>
        </main>
      </div>
    </ProSidebarProvider>
  );
}

export default App;
