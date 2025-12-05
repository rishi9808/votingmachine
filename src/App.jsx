import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EVMPage from './components/EVMPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<EVMPage />} />
          <Route path="/vote/:locationId" element={<EVMPage />} />
          <Route path="*" element={
            <div style={{ 
              minHeight: '100vh', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontFamily: 'Arial, sans-serif'
            }}>
              <div style={{ textAlign: 'center' }}>
                <h1>404 - Page not found</h1>
                <p>Please check the URL format: /vote/LOCATION_ID</p>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
