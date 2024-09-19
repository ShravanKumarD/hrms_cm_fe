import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from './env';

export default function withAuth(ComponentToProtect) {
  return function ProtectedComponent(props) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [redirect, setRedirect] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
      const token = localStorage.getItem('token');
      axios.defaults.baseURL = API_BASE_URL;

      axios({
        method: 'get',
        url: '/checkToken',
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          console.log(res.data.authData.user, 'res');
          setIsAuthenticated(true);
          console.log(`Access: ${isAuthenticated}`);
          localStorage.setItem('user', JSON.stringify(res.data.authData.user));
          setLoading(false);
        })
        .catch((err) => {
          console.log(err, 'error');
          console.log(`Access: ${isAuthenticated}`);
          // localStorage.removeItem('user')
          // localStorage.removeItem('token')
          setLoading(false);
          setRedirect(true);
        });
    }, [isAuthenticated]);

    if (loading) {
      return null;
    }
    if (redirect) {
      navigate('/login');
      return null;
    }
    return <ComponentToProtect {...props} />;
  };
}
