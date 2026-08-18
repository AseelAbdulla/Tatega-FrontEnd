import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const getProducts = async () => {
    const response = await axios.get(`${API_URL}/products`);

    return response.data.data;
};

export const getProduct = async (id) => {
    const response = await axios.get(`${API_URL}/products/${id}`);

    return response.data.data;
};