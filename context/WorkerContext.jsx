import React, { createContext, useState, useContext, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, doc, setDoc, updateDoc } from 'firebase/firestore';

const WorkerContext = createContext();

export const useWorkers = () => useContext(WorkerContext);

export const WorkerProvider = ({ children }) => {
  const [workers, setWorkers] = useState(() => {
    // Firebase 연결 전 로컬스토리지 백업 데이터 로드
    const savedWorkers = localStorage.getItem('smart_construction_workers');
    if (savedWorkers) {
      try { return JSON.parse(savedWorkers); } catch (e) { return []; }
    }
    return [];
  });

  useEffect(() => {
    if (db) {
      // Firebase 연동 시: 실시간 데이터 동기화 (Sync)
      const unsubscribe = onSnapshot(collection(db, 'workers'), (snapshot) => {
        const workerData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setWorkers(workerData);
        // Firebase 데이터를 로컬 스토리지에도 백업 캐싱
        localStorage.setItem('smart_construction_workers', JSON.stringify(workerData));
      }, (error) => {
        console.error("Firebase sync error:", error);
      });
      return () => unsubscribe();
    } else {
      // Firebase 미설정 시: 기존 로컬스토리지 저장 방식 유지
      localStorage.setItem('smart_construction_workers', JSON.stringify(workers));
    }
  }, [db, workers]); // workers 배열 변경 시 로컬스토리지 저장을 위해 의존성 배열에 추가

  const addWorker = async (worker) => {
    const newId = Date.now().toString();
    const newWorker = { ...worker, id: newId };
    
    if (db) {
      try {
        await setDoc(doc(db, 'workers', newId), newWorker);
      } catch (error) {
        console.error("Error adding worker to Firebase:", error);
        alert("데이터베이스 연결 오류로 로컬에만 임시 저장됩니다.");
        setWorkers(prev => [...prev, newWorker]); // Fallback
      }
    } else {
      setWorkers(prev => [...prev, newWorker]); // LocalStorage Fallback
    }
  };

  const updateWorker = async (id, updatedData) => {
    if (db) {
      try {
        const workerRef = doc(db, 'workers', id);
        await updateDoc(workerRef, updatedData);
      } catch (error) {
        console.error("Error updating worker in Firebase:", error);
        alert("데이터베이스 연결 오류로 로컬에만 임시 저장됩니다.");
        setWorkers(prev => prev.map(w => w.id === id ? { ...w, ...updatedData } : w)); // Fallback
      }
    } else {
      setWorkers(prev => prev.map(w => w.id === id ? { ...w, ...updatedData } : w)); // LocalStorage Fallback
    }
  };

  return (
    <WorkerContext.Provider value={{ workers, addWorker, updateWorker }}>
      {children}
    </WorkerContext.Provider>
  );
};
