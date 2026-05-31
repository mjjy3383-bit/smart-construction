import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft } from 'lucide-react';

export default function ManagerLogin() {
  const navigate = useNavigate();
  const [pin, setPin] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin === '123456') {
      navigate('/manager-dashboard');
    } else {
      alert('비밀번호가 일치하지 않습니다.');
      setPin('');
    }
  };

  return (
    <div style={{ padding: '20px', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <button className="back-btn" onClick={() => navigate('/')} style={{ color: 'var(--text-main)', marginBottom: '40px' }}>
        <ArrowLeft size={16} /> 뒤로가기
      </button>

      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Lock size={48} color="#475569" style={{ marginBottom: '16px' }}/>
        <h1 className="page-title" style={{ color: 'var(--text-main)' }}>관리자 접속</h1>
        <p className="page-subtitle" style={{ color: 'var(--text-secondary)' }}>현장 관리자 전용 6자리 PIN을 입력하세요.</p>
      </div>

      <form onSubmit={handleSubmit} style={{ background: 'white', padding: '32px 20px', borderRadius: '24px', boxShadow: 'var(--glass-shadow)' }}>
        <input 
          type="password"
          maxLength={6}
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="******"
          style={{
            width: '100%', padding: '16px', fontSize: '24px', letterSpacing: '8px',
            textAlign: 'center', border: '1px solid var(--border-color)', borderRadius: '12px',
            marginBottom: '20px'
          }}
          required
        />
        <button type="submit" className="submit-btn" style={{ background: '#475569' }}>
          접속하기
        </button>
      </form>
    </div>
  );
}
