import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google'; 
const CLIENT_ID="116444032940-vsjlr12q7f1lkba7imms6u3cdqinbba5.apps.googleusercontent.com"
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
    <App /></GoogleOAuthProvider>
  </React.StrictMode>
);

