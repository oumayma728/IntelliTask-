import './App.css';
import './index.css';

import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from './Context/AuthContext';
import { LoaderProvider } from './Context/LoaderContext'; // Import LoaderProvider
import AppRoutes from './Routes';

function App() {
  return (
    <div className='min-h-screen bg-gray-800'>
      <AuthProvider>
        <LoaderProvider> 
          <Router>
            <AppRoutes/>
          </Router>
        </LoaderProvider>
      </AuthProvider>
    </div>
  );
}

export default App;