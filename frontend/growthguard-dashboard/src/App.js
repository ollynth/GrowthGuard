// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/dashboard'; 

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    {/* Define routes */}
                    <Route path="/" element={<Dashboard />} />
                    {/* Add more routes here if needed */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;