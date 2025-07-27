import React, { useState } from 'react';
import './App.css';
import FancyHealthCheck from './page/FancyHealthCheck';
import HealthCheck from './page/HealthCheck';

function App() {
  const [healthStatus, setHealthStatus] = useState("Click the button to check health.");
  const [loading, setLoading] = useState(false);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/health');
      if (response.ok) {
        const data = await response.text(); // Get response as text
        setHealthStatus(`Health Status: ${data}`);
      } else {
        setHealthStatus(`Error: Unable to fetch health status. Status code: ${response.status}`);
      }
    } catch (error) {
      setHealthStatus(`Error: Could not connect to the backend. Is it running? (${error.message})`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <FancyHealthCheck/>
    </div>
  );
}

export default App;