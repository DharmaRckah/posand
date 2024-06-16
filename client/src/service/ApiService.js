import axios from 'axios';
import Constant from './Constant';
import {Store} from '../redux/Store'
import { selectToken } from './AuthSelector';

const getToken = () => selectToken(Store.getState());

export const getData = async (endPoint) => {
  const token = getToken();
  const url = `${Constant.base_url}${endPoint}`;
  const headers = {
    Accept: '*/*',
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const configObject = {
    headers,
  };

  try {
    const response = await axios.get(url, configObject);
    return response;
  } catch (error) {
    console.error('get apiService error -> ', error);
    throw error; // Re-throw the error after logging
  }
};

export const postData = async (endPoint, body) => {
  const token = getToken();
  const url = `${Constant.base_url}${endPoint}`;
  const headers = {
    Accept: '*/*',
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const configObject = {
    headers,
  };

  try {
    const response = await axios.post(url, body, configObject);
    return response;
  } catch (error) {
    console.error('post apiService error -> ', error);
    throw error; // Re-throw the error after logging
  }
};

export const putData = async (endPoint, body) => {
  const token = getToken();
  const url = `${Constant.base_url}${endPoint}`;
  const headers = {
    Accept: '*/*',
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const configObject = {
    headers,
  };

  try {
    const response = await axios.put(url, body, configObject);
    return response;
  } catch (error) {
    console.error('put apiService error -> ', error);
    throw error; // Re-throw the error after logging
  }
};

export const deleteData = async (endPoint) => {
  const token = getToken();
  const url = `${Constant.base_url}${endPoint}`;
  const headers = {
    Accept: '*/*',
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const configObject = {
    headers,
  };

  try {
    const response = await axios.delete(url, configObject);
    return response;
  } catch (error) {
    console.error('delete apiService error -> ', error);
    throw error; // Re-throw the error after logging
  }
};
