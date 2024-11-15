// api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND;

export const translateSingle = async (request) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/translate`,
      request
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to translate CV point');
    }
    throw error;
  }
};

export const star = async (request) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/star`,
      request
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to make STAR');
    }
    throw error;
  }
};

export const translateBulk = async (request) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/translate-bulk`,
      request
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to translate CV points');
    }
    throw error;
  }
};