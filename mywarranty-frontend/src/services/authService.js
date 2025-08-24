// import authHeader from "./authHeader";
// import axios from 'axios';

// const API_URL = 'http://localhost:5000/api/users'; // Your backend API base URL

// const register = async (userData) => {
//     const response = await axios.post(`${API_URL}/register`, userData);
//     if (response.data.token) {
//         localStorage.setItem('user', JSON.stringify(response.data));
//     }
//     return response.data;
// };

// const login = async (userData) => {
//   const response = await axios.post(`${API_URL}/login`, userData);

//   if (response.data.accessToken) {
//     localStorage.setItem("user", JSON.stringify({
//       accessToken: response.data.accessToken,
//       refreshToken: response.data.refreshToken
//     }));
//   }

//   return response.data;
// };

// const logout = () => {
//     localStorage.removeItem('user');
// };

// const authService = {
//     register,
//     login,
//     logout,
//     // New functions for user profile
//     getUserProfile: async () => {
//         const response = await axios.get(`${API_URL}`, authHeader());
//         return response.data;
//     },
//     updateUserProfile: async (userData) => {
//         const response = await axios.put(`${API_URL}`, userData, authHeader());
//         return response.data;
//     },

//     exportUserData: async () => {
//         const response = await axios.get(`${API_URL}/export`, authHeader());
//         return response.data;
//     },
// };

// export default authService;



// const login = async (userData) => {
//     const response = await axios.post(`${API_URL}/login`, userData);
//     if (response.data.accessToken) {
//         localStorage.setItem('user', JSON.stringify(response.data));
//     }
//     return response.data;
// };




// ✅ REGISTER
// const register = async (userData) => {
  //   try {
    //     const response = await axios.post(`${API_URL}/register`, userData);
    
    //     // Ensure response.data exists before using it
    //     if (response.data?.accessToken) {
      //       localStorage.setItem("user", JSON.stringify(response.data));
      //     }
      
      //     return response.data;
      //   } catch (error) {
        //     console.error("Register failed:", error.response?.data || error.message);
        //     throw error;
        //   }
        // };
        
        // // ✅ LOGIN
        // const login = async (userData) => {
          //   try {
            //     const response = await axios.post(`${API_URL}/login`, userData);
            
            //     if (response.data?.accessToken) {
              //       localStorage.setItem("user", JSON.stringify(response.data));
              //     }
              
              //     return response.data;
              //   } catch (error) {
                //     console.error("Login failed:", error.response?.data || error.message);
                //     throw error;
                //   }
                // };
                
//                 import authHeader from "./authHeader";
//                 import axios from "axios";
                
//                 const API_URL = "http://localhost:5000/api/users"; // Backend base URL

// const register = async (userData) => {
//   try {
//     const response = await axios.post(`${API_URL}/login`, userData);

//     if (response.data?.token) {
//       localStorage.setItem("token", response.data.token);
//     }
//     if (response.data?.user) {
//       localStorage.setItem("user", JSON.stringify(response.data.user));
//     }

//     return response.data;
//   } catch (error) {
//     console.error("login failed:", error.response?.data || error.message);
//     throw error;
//   }
// };

// // ✅ LOGIN
// const login = async (userData) => {
//   try {
//     const response = await axios.post(`${API_URL}/login`, userData);

//     if (response.data?.accessToken) {
//       localStorage.setItem("token", response.data.accessToken);
//     }
//     if (response.data?.refreshToken) {
//       localStorage.setItem("refreshToken", response.data.refreshToken);
//     }
//     if (response.data?.user) {
//       localStorage.setItem("user", JSON.stringify(response.data.user));
//     }

//     if (response.data.user.role === "admin") {
//         window.location.href = "/admin"; // admin dashboard
//       } else {
//         window.location.href = "/dashboard"; // normal user dashboard
//       }

//     return response.data;
//   } catch (error) {
//     console.error("Login failed:", error.response?.data || error.message);
//     throw error;
//   }
// };


// // ✅ LOGOUT
// const logout = () => {
//   localStorage.removeItem("user");
// };

// // ✅ USER FUNCTIONS
// const getUserProfile = async () => {
//   const response = await axios.get(`${API_URL}/profile`, { headers: authHeader() });
//   return response.data;
// };

// const updateUserProfile = async (userData) => {
//   const response = await axios.put(`${API_URL}/profile`, userData, { headers: authHeader() });
//   return response.data;
// };

// const exportUserData = async () => {
//   const response = await axios.get(`${API_URL}/export`, { headers: authHeader() });
//   return response.data;
// };

// // ✅ EXPORT
// const authService = {
//   register,
//   login,
//   logout,
//   getUserProfile,
//   updateUserProfile,
//   exportUserData,
// };

// export default authService;


import authHeader from "./authHeader";
import axios from "axios";

// Auth routes (login/register)
// const AUTH_URL = "http://localhost:5000/api/auth";
const AUTH_URL = "http://localhost:5000/api/users";

// User routes (profile/export)
const USER_URL = "http://localhost:5000/api/users";

// ✅ REGISTER
const register = async (userData) => {
  try {
    const response = await axios.post(`${AUTH_URL}/register`, userData);

    // if (response.data?.accessToken) {
    //   localStorage.setItem("token", response.data.accessToken);
    // }
    // if (response.data?.refreshToken) {
    //   localStorage.setItem("refreshToken", response.data.refreshToken);
    // }
    // if (response.data?.user) {
    //   localStorage.setItem("user", JSON.stringify(response.data.user));
    // }

    return response.data;
  } catch (error) {
    console.error("Register failed:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ LOGIN
const login = async (userData) => {
  try {
    const response = await axios.post(`${AUTH_URL}/login`, userData);

    if (response.data?.accessToken) {
      localStorage.setItem("token", response.data.accessToken);
    }
    if (response.data?.refreshToken) {
      localStorage.setItem("refreshToken", response.data.refreshToken);
    }
    if (response.data?.user) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    // redirect based on role
    if (response.data.user.role === "admin") {
      window.location.href = "/admin"; 
    } else {
      window.location.href = "/dashboard";
    }

    return response.data;
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ LOGOUT
const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
};

// ✅ USER FUNCTIONS
// const getUserProfile = async () => {
//   const response = await axios.get(`${USER_URL}/profile`, { headers: authHeader() });
//   return response.data;
// };
const getProfile = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${USER_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const updateUserProfile = async (userData) => {
  const response = await axios.put(`${USER_URL}/profile`, userData, { headers: authHeader() });
  return response.data;
};

const exportUserData = async () => {
  const response = await axios.get(`${USER_URL}/export`, { headers: authHeader() });
  return response.data;
};

// ✅ EXPORT
const authService = {
  register,
  login,
  logout,
  getProfile,
  updateUserProfile,
  exportUserData,
};

export default authService;
