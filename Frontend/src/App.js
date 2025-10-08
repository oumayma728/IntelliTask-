import logo from './logo.svg';
import './App.css';
import './index.css';

import { BrowserRouter as Router } from "react-router-dom";
import { Sidebar } from './Components/Sidebar';
import { AuthProvider } from './Context/AuthContext';
import AppRoutes from './Routes';

function App() {
  return (
    <div className='min-h-screen bg-gray-800'>
    <AuthProvider>
      <Router>
        <AppRoutes/>
      </Router>
    </AuthProvider></div>
  );
}

export default App;
