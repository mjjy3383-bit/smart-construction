import React, { useState, useEffect } from 'react';
import { useWorkers } from '../context/WorkerContext';
import { Video, X } from 'lucide-react';

export default function WorkerMapView() {
  const { workers } = useWorkers();
  const [selectedFloor, setSelectedFloor] = useState('1층');
  const [activeWorker, setActiveWorker] = useState(null);
  const [positions, setPositions] = useState({});

  // 초기 위치 세팅 및 이동 시뮬레이션
  useEffect(() => {
    const validWorkers = workers.filter(w => w.permitStatus === '허가 완료' && w.floor !== '미배정');
    
    // 초기 위치 불러오기 (Dashboard에서 랜덤 배정된 X, Y 활용)
    const initialPos = {};
    validWorkers.forEach(w => {
      initialPos[w.id] = { x: w.x || 50, y: w.y || 50 };
    });
    setPositions(initialPos);

    // 2초마다 위치 조금씩 랜덤 이동 (GPS 시뮬레이션)
    const interval = setInterval(() => {
      setPositions(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(id => {
          // 이동 반경 -2% ~ +2%
          let dx = (Math.random() - 0.5) * 4;
          let dy = (Math.random() - 0.5) * 4;
          
          let newX = next[id].x + dx;
          let newY = next[id].y + dy;

          // 도면 이탈 방지
          if (newX < 5) newX = 5;
          if (newX > 95) newX = 95;
          if (newY < 5) newY = 5;
          if (newY > 95) newY = 95;

          next[id] = { x: newX, y: newY };
        });
        return next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [workers]);

  const mapWorkers = workers.filter(w => w.permitStatus === '허가 완료' && w.floor === selectedFloor);

  return (
    <div style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: 'var(--glass-shadow)' }}>
      {/* 층수 선택기 (Z값 대체) */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '4px' }}>
        {['1층', '2층', '3층', '4층'].map(floor => (
          <button key={floor} onClick={() => { setSelectedFloor(floor); setActiveWorker(null); }}
            style={{ 
              padding: '8px 16px', borderRadius: '20px', fontWeight: '600', border: 'none', cursor: 'pointer',
              background: selectedFloor === floor ? 'var(--primary-color)' : '#f1f5f9',
              color: selectedFloor === floor ? 'white' : 'var(--text-secondary)'
            }}>
            {floor}
          </button>
        ))}
      </div>

      {/* 도면 영역 (X, Y 좌표 매핑) */}
      <div style={{ 
        position: 'relative', width: '100%', height: '400px', backgroundColor: '#0f172a', 
        borderRadius: '12px', overflow: 'hidden', backgroundImage: 'url(/blueprint.png)',
        backgroundSize: 'cover', backgroundPosition: 'center', border: '2px solid #334155'
      }}>
        <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(0,0,0,0.7)', color: '#10b981', padding: '4px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', border: '1px solid #10b981' }}>
          ● LIVE GPS TRACKING
        </div>

        {mapWorkers.map(w => {
          const pos = positions[w.id] || { x: w.x || 50, y: w.y || 50 };
          const isActive = activeWorker?.id === w.id;
          
          return (
            <div key={w.id} onClick={() => setActiveWorker(w)}
              style={{
                position: 'absolute', left: `${pos.x}%`, top: `${pos.y}%`,
                transform: 'translate(-50%, -50%)', cursor: 'pointer',
                transition: 'all 2s linear', zIndex: isActive ? 10 : 1
              }}>
              <div style={{
                width: isActive ? '18px' : '14px', height: isActive ? '18px' : '14px',
                backgroundColor: isActive ? '#f59e0b' : '#10b981',
                border: '2px solid white', borderRadius: '50%',
                boxShadow: isActive ? '0 0 15px #f59e0b' : '0 0 10px #10b981'
              }} />
              {isActive && (
                <div style={{ position: 'absolute', top: '-24px', left: '50%', transform: 'translateX(-50%)', background: 'black', color: 'white', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', whiteSpace: 'nowrap' }}>
                  {w.name}
                </div>
              )}
            </div>
          );
        })}
        
        {mapWorkers.length === 0 && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'rgba(255,255,255,0.5)', fontSize: '14px', fontWeight: '600' }}>
            해당 층에 투입된 작업자가 없습니다.
          </div>
        )}
      </div>

      {/* 층별 투입 인원 요약 */}
      <div style={{ marginTop: '16px', padding: '12px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <h4 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px' }}>현재 {selectedFloor} 투입 인원 ({mapWorkers.length}명)</h4>
        {mapWorkers.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {mapWorkers.map(w => (
              <span key={`summary-${w.id}`} style={{ fontSize: '12px', padding: '4px 10px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '16px', color: 'var(--text-main)', fontWeight: '600' }}>
                {w.name} <span style={{ color: 'var(--primary-color)' }}>{w.role}</span>
              </span>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>투입된 작업자가 없습니다.</p>
        )}
      </div>

      {/* 작업자 CCTV 패널 (클릭 시 노출) */}
      {activeWorker && (
        <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }}></span>
                {activeWorker.name} <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>({activeWorker.role})</span>
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>위치: {activeWorker.floor} - {activeWorker.authArea}</p>
            </div>
            <button onClick={() => setActiveWorker(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><X size={20} /></button>
          </div>

          {/* CCTV 영상 시뮬레이션 창 */}
          <div style={{ background: 'black', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '12px', left: '12px', color: '#ef4444', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px', zIndex: 2 }}>
              <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444', animation: 'blink 1s infinite' }}></span> REC
            </div>
            <div style={{ position: 'absolute', top: '12px', right: '12px', color: 'white', fontSize: '10px', opacity: 0.8, zIndex: 2 }}>
              <Video size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }}/> CH-04 ({activeWorker.floor})
            </div>
            
            <div style={{ width: '100%', height: '200px', background: 'repeating-linear-gradient(0deg, #1e293b, #1e293b 2px, #0f172a 2px, #0f172a 4px)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <Video size={48} color="#475569" style={{ marginBottom: '8px', opacity: 0.5 }} />
                <p style={{ color: '#94a3b8', fontSize: '12px' }}>최근접 카메라 스트리밍 중...</p>
                <p style={{ color: '#cbd5e1', fontSize: '14px', fontWeight: '600', marginTop: '8px' }}>타겟: {activeWorker.name} ({activeWorker.helmetId})</p>
              </div>
            </div>
            
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: 'rgba(255,255,255,0.2)', boxShadow: '0 0 10px rgba(255,255,255,0.5)', animation: 'scan 3s infinite linear' }} />
          </div>

          <style dangerouslySetInnerHTML={{__html: `
            @keyframes blink { 0% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 1; } }
            @keyframes scan { 0% { top: 0; } 100% { top: 100%; } }
          `}} />
        </div>
      )}
    </div>
  );
}
