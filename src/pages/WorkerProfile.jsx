import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWorkers } from '../context/WorkerContext';
import { 
  User, Building2, Wrench, ShieldCheck, GraduationCap, 
  ClipboardCheck, Phone, BellRing, ArrowLeft, CheckCircle2, XCircle
} from 'lucide-react';

export default function WorkerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { workers } = useWorkers();
  
  const workerData = workers.find(w => w.id === id);

  if (!workerData) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', paddingTop: '100px' }}>
        <h2>작업자를 찾을 수 없습니다.</h2>
        <button onClick={() => navigate(-1)} style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}>뒤로가기</button>
      </div>
    );
  }

  const isApproved = workerData.permitStatus === '허가 완료';

  return (
    <div>
      <div className="page-header" style={{ paddingBottom: '40px', background: isApproved ? 'linear-gradient(135deg, var(--primary-color) 0%, #086b3b 100%)' : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> 뒤로가기
        </button>
        <h1 className="page-title">등록된 작업자</h1>
        <p className="page-subtitle">작업자 정보 및 상태를 확인합니다.</p>
      </div>

      <div className="profile-content">
        <div className="status-badge-container">
          <div className="status-badge" style={{ color: isApproved ? 'var(--primary-color)' : '#d97706', borderColor: isApproved ? 'var(--primary-color)' : '#d97706' }}>
            {isApproved ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
            {isApproved ? '허용 구역 작업자' : '승인 대기중 (투입 불가)'}
          </div>
        </div>

        <div className="profile-card">
          <div className="profile-img-placeholder">
            <User size={40} />
          </div>
          <div className="profile-info">
            <h2>{workerData.name}</h2>
            <p>{workerData.helmetId}</p>
          </div>
        </div>

        <div className="details-list">
          <DetailRow icon={<User size={18}/>} label="이름" value={workerData.name} />
          <DetailRow icon={<Building2 size={18}/>} label="소속 회사" value={workerData.company} />
          <DetailRow icon={<Wrench size={18}/>} label="공종" value={workerData.role} />
          <DetailRow icon={<ShieldCheck size={18}/>} label="권한 구역" value={workerData.authArea} />
          <DetailRow icon={<GraduationCap size={18}/>} label="안전교육" value={workerData.safetyTraining} />
          <DetailRow 
            icon={<ClipboardCheck size={18}/>} 
            label="허가 상태" 
            value={workerData.permitStatus} 
            highlight={isApproved} 
            error={!isApproved}
          />
          <DetailRow icon={<Phone size={18}/>} label="연락처" value={workerData.phone} />
          <DetailRow icon={<BellRing size={18}/>} label="비상 연락" value={workerData.emergencyPhone} />
        </div>
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value, highlight, error }) {
  let valueColor = 'var(--text-main)';
  if (highlight) valueColor = 'var(--success-color)';
  if (error) valueColor = '#d97706';

  return (
    <div className="detail-item">
      <div className="detail-icon">{icon}</div>
      <div className="detail-label">{label}</div>
      <div className="detail-value" style={{ color: valueColor }}>{value}</div>
    </div>
  );
}
