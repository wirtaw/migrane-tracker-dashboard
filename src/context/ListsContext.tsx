// ListsContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ListsContextProps {
  medicationList: string[];
  setMedicationList: React.Dispatch<React.SetStateAction<string[]>>;
  symptomList: string[];
  setSymptomList: React.Dispatch<React.SetStateAction<string[]>>;
  incidentList: string[];
  setIncidentList: React.Dispatch<React.SetStateAction<string[]>>;
  triggerList: string[];
  setTriggerList: React.Dispatch<React.SetStateAction<string[]>>;
}

const ListsContext = createContext<ListsContextProps | undefined>(undefined);

export const ListsProvider = ({ children }: { children: ReactNode }) => {
  const [medicationList, setMedicationList] = useState<string[]>([
    'Aspirin',
    'Ibuprofen',
    'Paracetamol',
    'Amoxicillin',
    'Metformin',
  ]);

  const [symptomList, setSymptomList] = useState<string[]>([
    'Confused Thinking',
    'Constipation',
    'Dizziness',
    'Light Sensitivity',
    'Nausea',
    'Noise Sensitivity',
    'Smelly',
    'Weather (loud wind)',
  ]);

  const [incidentList, setIncidentList] = useState<string[]>([
    'Migraine Attack',
    'Aura Episode',
    'Tension Headache',
    'Fever',
    'Cold',
    'Flu',
    'Other',
  ]);

  const [triggerList, setTriggerList] = useState<string[]>([
    'Stress',
    'Lack of Sleep',
    'Food',
    'Weather',
    'Exercise',
    'Medication',
  ]);

  return (
    <ListsContext.Provider
      value={{
        medicationList,
        setMedicationList,
        symptomList,
        setSymptomList,
        incidentList,
        setIncidentList,
        triggerList,
        setTriggerList,
      }}
    >
      {children}
    </ListsContext.Provider>
  );
};

export const useListsContext = () => {
  const context = useContext(ListsContext);
  if (!context) {
    throw new Error('useListsContext must be used within a ListsProvider');
  }
  return context;
};
