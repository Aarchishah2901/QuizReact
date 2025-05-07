import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element }) => {
const user = JSON.parse(localStorage.getItem('user'));

if (!user) {
return <Navigate to="/" />;
}

return element;
};

export default PrivateRoute;