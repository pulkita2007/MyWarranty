
// import React from 'react';
// import { Navigate } from 'react-router-dom';

// const PrivateRoute = ({ children }) => {
//     const user = JSON.parse(localStorage.getItem('user'));
//      const token = localStorage.getItem("accessToken");
//     return token && user ? children : <Navigate to="/login" />;
// };

// export default PrivateRoute;

import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, adminOnly }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token") || localStorage.getItem("accessToken");

  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/dashboard" />; // redirect normal users away
  }

  return children;
};

export default PrivateRoute;
