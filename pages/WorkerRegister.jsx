import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkers } from '../context/WorkerContext';
import { ArrowLeft, Upload, HardHat } from 'lucide-react';

export default function WorkerRegister() {
  const navigate = useNavigate();
  const { addWorker } = useWorkers();

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    role: '철근', // default role
    phone: '',
    safetyTrainingImageName: null,
    safetyTrainingImageUrl: null
  });

  const [generatedSerial, setGeneratedSerial] = useState('');

  // 공종 코드 매핑 (예시)
  const roleCodeMap = {
    '철근': '01',
    '형틀': '02',
    '타설': '03',
    '전기': '04',
    '설비': '05',
    '목공': '06',
    '경량': '07',
    '철거': '08',
    '청소': '09',
    '기타': '99'
  };

  useEffect(() => {
    // 전화번호 맨 뒤 4자리 추출
    const phoneDigits = formData.phone.replace(/[^0-9]/g, '');
    let last4 = '0000';
    if (phoneDigits.length >= 4) {
      last4 = phoneDigits.slice(-4);
    }
    
    // 공종 코드 추출
    const code = roleCodeMap[formData.role] || '99';
    
    // 연도 2자리 (요구사항 고정값 26)
    const year = '26';
    
    if (formData.phone.length > 0) {
      setGeneratedSerial(`${year}-${code}-${last4}`);
    } else {
      setGeneratedSerial('');
    }
  }, [formData.role, formData.phone]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setFormData({ 
        ...formData, 
        safetyTrainingImageName: file.name,
        safetyTrainingImageUrl: imageUrl 
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) {
      alert("이름과 연락처는 필수입니다.");
      return;
    }

    const newWorker = {
      ...formData,
      helmetId: generatedSerial, // Generated serial ID
      authArea: '미배정 (관리자 승인 대기)', // Not yet assigned
      safetyTraining: formData.safetyTrainingImageName ? '확인 대기 (사진 첨부됨)' : '미제출',
      safetyTrainingImageUrl: formData.safetyTrainingImageUrl,
      permitStatus: '미승인', // Default false
      emergencyPhone: '미등록',
    };

    addWorker(newWorker);
    alert('작업자 등록이 완료되었습니다. 현장 관리자의 승인을 대기해 주세요.');
    navigate('/');
  };

  return (
    <div>
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={16} /> 홈으로
        </button>
        <h1 className="page-title">작업자 직접 등록</h1>
        <p className="page-subtitle">작업에 투입되기 전 기초 정보를 등록합니다.</p>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">이름</label>
            <input 
              type="text" name="name" className="form-input" 
              value={formData.name} onChange={handleChange} placeholder="작업자 이름 입력" required
            />
          </div>

          <div className="form-group">
            <label className="form-label">연락처</label>
            <input 
              type="text" name="phone" className="form-input" 
              value={formData.phone} onChange={handleChange} placeholder="010-XXXX-XXXX" required
            />
          </div>

          <div className="form-group">
            <label className="form-label">소속 회사</label>
            <input 
              type="text" name="company" className="form-input" 
              value={formData.company} onChange={handleChange} placeholder="소속 회사명 입력"
            />
          </div>

          <div className="form-group">
            <label className="form-label">공종 선택</label>
            <select name="role" className="form-input" value={formData.role} onChange={handleChange} style={{ appearance: 'auto' }}>
              <option value="철근">철근</option>
              <option value="형틀">형틀</option>
              <option value="타설">타설</option>
              <option value="전기">전기</option>
              <option value="설비">설비</option>
              <option value="목공">목공</option>
              <option value="경량">경량</option>
              <option value="철거">철거</option>
              <option value="청소">청소</option>
              <option value="기타">기타</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">안전교육 이수증 (사진 첨부)</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="file" accept="image/*"
                id="file-upload"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload" style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 16px',
                border: '1px dashed var(--primary-color)', borderRadius: '12px',
                background: 'var(--primary-light)', color: 'var(--primary-color)',
                cursor: 'pointer', fontWeight: '600', justifyContent: 'center'
              }}>
                <Upload size={18} />
                {formData.safetyTrainingImageName ? formData.safetyTrainingImageName : '이수증 이미지 업로드'}
              </label>
            </div>
            
            {formData.safetyTrainingImageUrl && (
              <div style={{ marginTop: '12px', textAlign: 'center' }}>
                <img src={formData.safetyTrainingImageUrl} alt="이수증 미리보기" style={{ maxWidth: '100%', maxHeight: '120px', borderRadius: '8px', border: '1px solid var(--border-color)', objectFit: 'cover' }} />
              </div>
            )}
          </div>

          {generatedSerial && (
            <div style={{ 
              background: '#f8fafc', padding: '16px', borderRadius: '12px', 
              border: '1px solid #e2e8f0', marginBottom: '20px', textAlign: 'center'
            }}>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>생성된 헬멧 일련번호</p>
              <p style={{ fontSize: '20px', fontWeight: '700', color: 'var(--primary-color)', letterSpacing: '2px' }}>
                {generatedSerial}
              </p>
            </div>
          )}

          <button type="submit" className="submit-btn">
            <HardHat size={20} />
            정보 등록 및 승인 요청
          </button>
        </form>
      </div>
    </div>
  );
}
