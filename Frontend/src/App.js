import logo from './logo.svg';
import './App.css';
import './index.css';

import { BrowserRouter as Router } from "react-router-dom";

import { AuthProvider } from './Context/AuthContext';
import AppRoutes from './Routes';

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes/>
      </Router>
    </AuthProvider>
  );
}

export default App;
