import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HardHat, ClipboardList, ShieldAlert } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '20px', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <ShieldAlert size={48} color="var(--primary-color)" style={{ marginBottom: '16px' }}/>
        <h1 className="page-title" style={{ color: 'var(--text-main)' }}>스마트 건설 관리</h1>
        <p className="page-subtitle" style={{ color: 'var(--text-secondary)' }}>역할을 선택해 주세요</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <button 
          onClick={() => navigate('/worker-register')}
          style={{
            padding: '24px', background: 'white', border: '2px solid var(--primary-light)',
            borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px',
            cursor: 'pointer', boxShadow: 'var(--glass-shadow)', textAlign: 'left'
          }}
        >
          <div style={{ background: 'var(--primary-light)', padding: '12px', borderRadius: '50%' }}>
            <HardHat size={28} color="var(--primary-color)" />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', marginBottom: '4px', color: 'var(--text-main)' }}>작업자</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>정보 등록 및 안전교육 이수증 제출</p>
          </div>
        </button>

        <button 
          onClick={() => navigate('/manager-login')}
          style={{
            padding: '24px', background: 'white', border: '2px solid #e2e8f0',
            borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px',
            cursor: 'pointer', boxShadow: 'var(--glass-shadow)', textAlign: 'left'
          }}
        >
          <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '50%' }}>
            <ClipboardList size={28} color="#475569" />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', marginBottom: '4px', color: 'var(--text-main)' }}>관리자</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>작업 승인 및 현장 모니터링</p>
          </div>
        </button>
      </div>
    </div>
  );
}
