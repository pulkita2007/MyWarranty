import axios from 'axios';

const API_URL = 'http://localhost:5000/api/bills'; // Backend API base URL for bills

// Get user token from localStorage
const getToken = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.token : null;
};

// Helper function to create auth headers
const authHeader = () => ({
    headers: {
        'x-auth-token': getToken(),
    },
});

// Add new bill
const addBill = async (billData) => {
    const response = await axios.post(API_URL, billData, authHeader());
    return response.data;
};

// Get all user bills
const getBills = async () => {
    const response = await axios.get(API_URL, authHeader());
    return response.data;
};

// Update a bill
const updateBill = async (id, billData) => {
    const response = await axios.put(`${API_URL}/${id}`, billData, authHeader());
    return response.data;
};

// Delete a bill
const deleteBill = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, authHeader());
    return response.data;
};

const billService = {
    addBill,
    getBills,
    updateBill,
    deleteBill,
};

export default billService;
