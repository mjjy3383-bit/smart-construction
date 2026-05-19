import React, { createContext, useState, useContext } from 'react';

const WorkerContext = createContext();

export const useWorkers = () => useContext(WorkerContext);

export const WorkerProvider = ({ children }) => {
  const [workers, setWorkers] = useState([]);

  const addWorker = (worker) => {
    setWorkers((prev) => [...prev, { ...worker, id: Date.now().toString() }]);
  };

  const updateWorker = (id, updatedData) => {
    setWorkers((prev) => prev.map(w => w.id === id ? { ...w, ...updatedData } : w));
  };

  return (
    <WorkerContext.Provider value={{ workers, addWorker, updateWorker }}>
      {children}
    </WorkerContext.Provider>
  );
};
