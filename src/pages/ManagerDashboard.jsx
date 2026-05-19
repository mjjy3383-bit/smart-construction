import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkers } from '../context/WorkerContext';
import { ArrowLeft, UserCheck, Settings, CheckCircle2, XCircle } from 'lucide-react';

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const { workers, updateWorker } = useWorkers();
  const [editingId, setEditingId] = useState(null);
  
  // Edit Form State
  const [editForm, setEditForm] = useState({});

  const handleEditClick = (worker) => {
    setEditingId(worker.id);
    setEditForm({
      authArea: worker.authArea === '미배정 (관리자 승인 대기)' ? '' : worker.authArea,
      emergencyPhone: worker.emergencyPhone === '미등록' ? '' : worker.emergencyPhone,
      safetyTraining: worker.safetyTraining,
      permitStatus: worker.permitStatus
    });
  };

  const handleSave = () => {
    updateWorker(editingId, editForm);
    setEditingId(null);
    alert('작업자 상태가 갱신되었습니다.');
  };

  return (
    <div style={{ paddingBottom: '40px' }}>
      <div className="page-header" style={{ background: 'linear-gradient(135deg, #475569 0%, #334155 100%)' }}>
        <button className="back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={16} /> 로그아웃
        </button>
        <h1 className="page-title">현장 관리자 대시보드</h1>
        <p className="page-subtitle">작업자 승인 및 상태 관리</p>
      </div>

      <div style={{ padding: '0 20px' }}>
        {workers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)', background: 'white', borderRadius: '16px', boxShadow: 'var(--glass-shadow)' }}>
            등록된 작업자가 없습니다.
          </div>
        ) : (
          workers.map(worker => (
            <div key={worker.id} style={{
              background: 'white', borderRadius: '16px', padding: '20px', 
              boxShadow: 'var(--glass-shadow)', marginBottom: '16px',
              borderLeft: `4px solid ${worker.permitStatus === '허가 완료' ? 'var(--success-color)' : '#f59e0b'}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '700' }}>{worker.name} <span style={{ fontSize: '14px', fontWeight: '400', color: 'var(--text-secondary)' }}>{worker.role}</span></h3>
                  <p style={{ fontSize: '13px', color: 'var(--primary-color)', fontWeight: '600' }}>{worker.helmetId}</p>
                </div>
                {worker.permitStatus === '허가 완료' ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--success-color)', fontSize: '12px', fontWeight: '600', background: 'var(--primary-light)', padding: '4px 8px', borderRadius: '12px' }}><CheckCircle2 size={14}/> 허가됨</span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontSize: '12px', fontWeight: '600', background: '#fef3c7', padding: '4px 8px', borderRadius: '12px' }}><XCircle size={14}/> 미승인</span>
                )}
              </div>

              {editingId === worker.id ? (
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                  <div className="form-group" style={{ marginBottom: '12px' }}>
                    <label className="form-label" style={{ fontSize: '12px' }}>권한 구역 배정</label>
                    <input type="text" className="form-input" style={{ padding: '10px' }}
                      value={editForm.authArea} onChange={(e) => setEditForm({...editForm, authArea: e.target.value})} placeholder="예: A동 1~5층" />
                  </div>
                  <div className="form-group" style={{ marginBottom: '12px' }}>
                    <label className="form-label" style={{ fontSize: '12px' }}>비상 연락망</label>
                    <input type="text" className="form-input" style={{ padding: '10px' }}
                      value={editForm.emergencyPhone} onChange={(e) => setEditForm({...editForm, emergencyPhone: e.target.value})} placeholder="예: 현장소장 010-0000-0000" />
                  </div>
                  <div className="form-group" style={{ marginBottom: '12px' }}>
                    <label className="form-label" style={{ fontSize: '12px' }}>안전교육 이수 확인 (사진 확인 후 승인)</label>
                    {worker.safetyTrainingImageUrl && (
                      <div style={{ marginBottom: '12px', background: '#f8fafc', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>첨부된 이수증 (클릭하여 원본 보기)</p>
                        <a href={worker.safetyTrainingImageUrl} target="_blank" rel="noreferrer">
                          <img src={worker.safetyTrainingImageUrl} alt="이수증 원본" style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '8px', border: '1px solid var(--border-color)', objectFit: 'cover' }} />
                        </a>
                      </div>
                    )}
                    <select className="form-input" style={{ padding: '10px', appearance: 'auto' }}
                      value={editForm.safetyTraining} onChange={(e) => setEditForm({...editForm, safetyTraining: e.target.value})}>
                      <option value="확인 대기 (사진 첨부됨)">확인 대기 (사진 첨부됨)</option>
                      <option value="미제출">미제출</option>
                      <option value="이수 승인 완료">이수 승인 완료 (사진 확인됨)</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label className="form-label" style={{ fontSize: '12px' }}>최종 작업상태 허가 여부</label>
                    <select className="form-input" style={{ padding: '10px', appearance: 'auto', background: editForm.permitStatus === '허가 완료' ? 'var(--primary-light)' : '#fef3c7' }}
                      value={editForm.permitStatus} onChange={(e) => setEditForm({...editForm, permitStatus: e.target.value})}>
                      <option value="미승인">미승인 (투입 불가)</option>
                      <option value="허가 완료">허가 완료 (현장 투입 가능)</option>
                    </select>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => setEditingId(null)} style={{ flex: 1, padding: '12px', background: 'var(--bg-color)', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>취소</button>
                    <button onClick={handleSave} style={{ flex: 1, padding: '12px', background: '#475569', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>저장</button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <button onClick={() => handleEditClick(worker)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '8px', background: 'var(--bg-color)', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                    <Settings size={14} /> 권한 및 승인 관리
                  </button>
                  <button onClick={() => navigate(`/profile/${worker.id}`)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '8px', background: 'var(--primary-light)', color: 'var(--primary-color)', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                    <UserCheck size={14} /> 프로필 뷰 확인
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
