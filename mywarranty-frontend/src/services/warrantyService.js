import axios from 'axios';

const API_URL = 'http://localhost:5000/api/warranties'; // Backend API base URL for warranties

// Get user token from localStorage
const getToken = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.token : null;
};

// Helper function to create auth headers
// const authHeader = () => ({
//     headers: {
//         'x-auth-token': getToken(),
//     },
// });

// const authHeader = () => {
//   const user = JSON.parse(localStorage.getItem('user'));
//   if (user && user.accessToken) {
//     return {
//       headers: { Authorization: `Bearer ${user.accessToken}` },
//     };
//   } else {
//     return {};
//   }
// };
const authHeader = () => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    return {
      headers: { Authorization: `Bearer ${accessToken}` },
    };
  } else {
    return {};
  }
};

// Add new warranty
const addWarranty = async (warrantyData) => {
    const response = await axios.post(API_URL, warrantyData, authHeader());
    return response.data;
};

// Get all user warranties
const getWarranties = async () => {
    const response = await axios.get(API_URL, authHeader());
    return response.data;
};

// Get expired warranties (assuming backend has a specific route for this, or we filter on frontend)
const getExpiredWarranties = async () => {
    // For now, we will fetch all warranties and filter expired ones on the frontend
    // In a real application, a dedicated backend endpoint would be more efficient
    const allWarranties = await getWarranties();
    const today = new Date();
    return allWarranties.filter(warranty => new Date(warranty.expiryDate) < today);
};

// Update a warranty
const updateWarranty = async (id, warrantyData) => {
    const response = await axios.put(`${API_URL}/${id}`, warrantyData, authHeader());
    return response.data;
};

// Delete a warranty
const deleteWarranty = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, authHeader());
    return response.data;
};

const warrantyService = {
    addWarranty,
    getWarranties,
    getExpiredWarranties,
    updateWarranty,
    deleteWarranty,
};

export default warrantyService;
