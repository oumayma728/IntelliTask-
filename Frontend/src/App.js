import './App.css';
import './index.css';

import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from './Context/AuthContext';
import { LoaderProvider } from './Context/LoaderContext';
import { ThemeProvider } from './Context/ThemeContext';
import AppRoutes from './Routes';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LoaderProvider>
          <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-colors">
            <Router>
              <AppRoutes />
            </Router>
          </div>
        </LoaderProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
