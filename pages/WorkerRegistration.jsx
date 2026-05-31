import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, HardHat, ChevronRight } from 'lucide-react';

export default function WorkerRegistration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    helmetId: 'HLM-23-04782',
    name: '홍길동',
    company: '스마트건설(주)',
    role: '철근콘크리트',
    authArea: 'A동 1~5층, B동 지하 1층',
    safetyTraining: '이수 (2024.05.10)',
    permitStatus: '허가 완료',
    phone: '010-1234-5678',
    emergencyPhone: '현장소장 010-9876-5432'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate saving data and passing to profile page
    navigate('/profile', { state: { workerData: formData } });
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">작업자 등록 및 QR 스캔</h1>
        <p className="page-subtitle">헬멧 QR 코드를 스캔하거나 정보를 직접 입력하여 등록하세요.</p>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">헬멧 일련번호 (QR 자동입력)</label>
            <input 
              type="text" 
              name="helmetId"
              className="form-input" 
              value={formData.helmetId}
              onChange={handleChange}
              placeholder="예: HLM-23-00000"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">이름</label>
            <input 
              type="text" 
              name="name"
              className="form-input" 
              value={formData.name}
              onChange={handleChange}
              placeholder="작업자 이름"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">소속 회사</label>
            <input 
              type="text" 
              name="company"
              className="form-input" 
              value={formData.company}
              onChange={handleChange}
              placeholder="소속 회사명"
            />
          </div>

          <div className="form-group">
            <label className="form-label">공종</label>
            <input 
              type="text" 
              name="role"
              className="form-input" 
              value={formData.role}
              onChange={handleChange}
              placeholder="예: 철근, 형틀, 전기 등"
            />
          </div>

          <div className="form-group">
            <label className="form-label">권한 구역</label>
            <input 
              type="text" 
              name="authArea"
              className="form-input" 
              value={formData.authArea}
              onChange={handleChange}
              placeholder="허용된 작업 구역"
            />
          </div>

          <div className="form-group">
            <label className="form-label">연락처</label>
            <input 
              type="text" 
              name="phone"
              className="form-input" 
              value={formData.phone}
              onChange={handleChange}
              placeholder="연락처"
            />
          </div>

          <button type="submit" className="submit-btn">
            <QrCode size={20} />
            정보 등록 및 인터페이스 확인
          </button>
        </form>
      </div>
    </div>
  );
}
