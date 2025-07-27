import React, { useState, useEffect } from 'react';
import './FancyHealthCheck.css'; // 스타일링을 위한 CSS 파일

// SVG 아이콘들
const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
  </svg>
);

const IconError = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
  </svg>
);


function FancyHealthCheck() {
  const [status, setStatus] = useState('idle'); // idle, checking, success, error
  const [logs, setLogs] = useState([]);
  const [finalMessage, setFinalMessage] = useState('');

  // 타이핑 효과를 위한 로그 메시지들
  const checkingLogs = [
    'Initializing connection...',
    'Pinging server gateway...',
    'Awaiting signal response...',
    'Parsing health status...'
  ];

  const resetState = () => {
    setStatus('idle');
    setLogs([]);
    setFinalMessage('');
  };

  const handleHealthCheck = async () => {
    if (status === 'checking') return;
    
    setStatus('checking');
    setLogs([]);
    setFinalMessage('');

    // 타이핑 애니메이션 효과
    for (let i = 0; i < checkingLogs.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 400));
      setLogs(prev => [...prev, checkingLogs[i]]);
    }
    
    await new Promise(resolve => setTimeout(resolve, 500)); // 마지막 로그 후 잠시 대기

    try {
      const response = await fetch('http://localhost:8080/api/health');
      const data = await response.text();

      if (response.ok) {
        setStatus('success');
        setFinalMessage(`[${response.status}] ${data}`);
      } else {
        setStatus('error');
        setFinalMessage(`[${response.status}] Server Response Error`);
      }
    } catch (error) {
      setStatus('error');
      setFinalMessage('Network Error: Cannot connect to the server.');
    }
  };

  // status가 success 또는 error일 때, 5초 후에 idle 상태로 돌아감
  useEffect(() => {
    if (status === 'success' || status === 'error') {
      const timer = setTimeout(() => {
        resetState();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);


  return (
    <div className={`hc-container hc-status-${status}`}>
      <div className="hc-monitor">
        <div className="hc-scanline"></div>
        <div className="hc-content">
          
          {status === 'idle' && (
            <div className="hc-idle-state">
              <h2>SYSTEM STATUS</h2>
              <p>Ready to check server health.</p>
            </div>
          )}

          {status === 'checking' && (
             <div className="hc-logs">
                {logs.map((log, index) => (
                  <p key={index} className="hc-log-entry">{log}</p>
                ))}
             </div>
          )}

          {(status === 'success' || status === 'error') && (
            <div className="hc-result">
              <div className="hc-result-icon">
                {status === 'success' ? <IconCheck /> : <IconError />}
              </div>
              <h3>{status === 'success' ? 'CONNECTION ESTABLISHED' : 'CONNECTION FAILED'}</h3>
              <p>{finalMessage}</p>
            </div>
          )}

        </div>
        <div className="hc-ekg">
          <svg className="hc-ekg-svg" viewBox="0 0 100 20" preserveAspectRatio="none">
            {status === 'checking' && <path className="hc-ekg-path-checking" d="M0 10 L10 10 L12 5 L14 15 L16 8 L18 12 L20 10 L100 10" />}
            {status === 'success' && <path className="hc-ekg-path-success" d="M0 10 L10 10 Q 12.5 5, 15 10 T 20 10 L 100 10" />}
            {status === 'error' && <path className="hc-ekg-path-error" d="M0 10 L100 10" />}
          </svg>
        </div>
      </div>
      <button 
        className="hc-button" 
        onClick={status === 'idle' ? handleHealthCheck : resetState}
        disabled={status === 'checking'}
      >
        {status === 'idle' && 'RUN DIAGNOSTICS'}
        {status === 'checking' && 'ANALYZING...'}
        {(status === 'success' || status === 'error') && 'RESET'}
      </button>
    </div>
  );
}

export default FancyHealthCheck;