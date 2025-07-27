import React, { useState } from 'react';

export default function HealthCheck() {
  // 서버 응답을 저장할 state
  const [healthStatus, setHealthStatus] = useState('');

  const handleHealthCheck = async () => {
    try {
      // Spring Boot 서버의 Health Check API 호출
      const response = await fetch('http://localhost:8080/api/health');
      const data = await response.text(); // 응답 본문을 텍스트로 가져옴

      if (response.ok) {
        // 성공 (HTTP 상태 코드가 200-299)
        setHealthStatus(`✅ [${response.status}] ${data}`);
      } else {
        // 서버 측 에러 (HTTP 상태 코드가 4xx, 5xx 등)
        setHealthStatus(`❌ [${response.status}] 서버 응답 오류: ${data}`);
      }
    } catch (error) {
      // 네트워크 에러 또는 fetch 실패
      setHealthStatus('❌ 연결 실패: Spring Boot 서버가 실행 중인지 확인하세요.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>서버 상태 확인 🩺</h2>
      <button onClick={handleHealthCheck}>헬스체크</button>
      {/* healthStatus에 값이 있을 때만 p 태그를 렌더링 */}
      {healthStatus && (
        <p style={{ marginTop: '15px', fontWeight: 'bold' }}>
          {healthStatus}
        </p>
      )}
    </div>
  );
}
