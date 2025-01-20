// ProfileDataContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import {
  Trigger,
  Incident,
  Medication,
  Symptom,
  Weight,
  Height,
  BloodPressure,
  ProfileSettingsData,
  ProfileSecurityData,
} from '../models/profileData.types';
import { useAuth } from './AuthContext';
import { env } from '../config/env';

interface ProfileDataContextProps {
  triggerList: Trigger[];
  setTriggerList: React.Dispatch<React.SetStateAction<Trigger[]>>;
  incidentList: Incident[];
  setIncidentList: React.Dispatch<React.SetStateAction<Incident[]>>;
  medicationList: Medication[];
  setMedicationList: React.Dispatch<React.SetStateAction<Medication[]>>;
  symptomList: Symptom[];
  setSymptomList: React.Dispatch<React.SetStateAction<Symptom[]>>;
  medicationEnumList: string[];
  setMedicationEnumList: React.Dispatch<React.SetStateAction<string[]>>;
  symptomEnumList: string[];
  setSymptomEnumList: React.Dispatch<React.SetStateAction<string[]>>;
  incidentEnumList: string[];
  setIncidentEnumList: React.Dispatch<React.SetStateAction<string[]>>;
  triggerEnumList: string[];
  setTriggerEnumList: React.Dispatch<React.SetStateAction<string[]>>;
  weightList: Weight[];
  setWeightList: React.Dispatch<React.SetStateAction<Weight[]>>;
  heightList: Height[];
  setHeightList: React.Dispatch<React.SetStateAction<Height[]>>;
  bloodPressureList: BloodPressure[];
  setBloodPressureList: React.Dispatch<React.SetStateAction<BloodPressure[]>>;
  profileSettingsData: ProfileSettingsData;
  setProfileSettingsData: React.Dispatch<React.SetStateAction<ProfileSettingsData>>;
  profileSecurityData: ProfileSecurityData;
  setProfileSecurityData: React.Dispatch<React.SetStateAction<ProfileSecurityData>>;
}

const ProfileDataContext = createContext<ProfileDataContextProps | undefined>(undefined);

export const ProfileDataProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const userId: string = user?.id || '1';
  const [triggerList, setTriggerList] = useState<Trigger[]>([
    {
      id: 1,
      userId,
      type: 'Stress',
      note: 'Work stress',
      createdAt: new Date('2025-01-01'),
      datetimeAt: new Date('2025-01-01'),
    },
    {
      id: 2,
      userId,
      type: 'Lack of Sleep',
      note: 'Work stress',
      createdAt: new Date('2025-01-07'),
      datetimeAt: new Date('2025-01-07'),
    },
  ]);
  const [incidentList, setIncidentList] = useState<Incident[]>([
    {
      id: 1,
      userId,
      type: 'Migraine Attack',
      startTime: new Date('2025-01-01'),
      durationHours: 5,
      notes: 'Severe headache',
      triggers: ['Stress'],
      createdAt: new Date('2025-01-01'),
      datetimeAt: new Date('2025-01-01'),
    },
    {
      id: 2,
      userId,
      type: 'Tension Headache',
      startTime: new Date('2025-01-05'),
      durationHours: 3,
      notes: 'Mild headache',
      triggers: ['Lack of Sleep'],
      createdAt: new Date('2025-01-05'),
      datetimeAt: new Date('2025-01-05'),
    },
  ]);
  const [medicationList, setMedicationList] = useState<Medication[]>([
    {
      id: 1,
      userId,
      title: 'Aspirin',
      dosage: '500mg',
      notes: 'Take with food',
      datetimeAt: new Date('2025-01-01'),
      createdAt: new Date('2025-01-01'),
      updateAt: new Date('2025-01-01'),
    },
    {
      id: 2,
      userId,
      title: 'Ibuprofen',
      dosage: '400mg',
      notes: 'Take with food',
      datetimeAt: new Date('2025-01-06'),
      createdAt: new Date('2025-01-06'),
      updateAt: new Date('2025-01-06'),
    },
  ]);
  const [symptomList, setSymptomList] = useState<Symptom[]>([
    {
      id: 1,
      userId,
      type: 'Nausea',
      severity: 3,
      notes: 'Vomiting',
      createdAt: new Date('2025-01-01'),
      datetimeAt: new Date('2025-01-01'),
    },
    {
      id: 2,
      userId,
      type: 'Dizziness',
      severity: 2,
      notes: 'Fainting',
      createdAt: new Date('2025-01-01'),
      datetimeAt: new Date('2025-01-01'),
    },
    {
      id: 3,
      userId,
      type: 'Dizziness',
      severity: 2,
      notes: 'Fainting',
      createdAt: new Date('2025-01-04'),
      datetimeAt: new Date('2025-01-04'),
    },
  ]);

  const [medicationEnumList, setMedicationEnumList] = useState<string[]>([
    'Aspirin',
    'Ibuprofen',
    'Paracetamol',
    'Amoxicillin',
    'Metformin',
  ]);

  const [symptomEnumList, setSymptomEnumList] = useState<string[]>([
    'Confused Thinking',
    'Constipation',
    'Dizziness',
    'Light Sensitivity',
    'Nausea',
    'Noise Sensitivity',
    'Smelly',
    'Weather (loud wind)',
  ]);

  const [incidentEnumList, setIncidentEnumList] = useState<string[]>([
    'Migraine Attack',
    'Aura Episode',
    'Tension Headache',
    'Fever',
    'Cold',
    'Flu',
    'Other',
  ]);

  const [triggerEnumList, setTriggerEnumList] = useState<string[]>([
    'Stress',
    'Lack of Sleep',
    'Food',
    'Weather',
    'Exercise',
    'Medication',
  ]);

  const [weightList, setWeightList] = useState<Weight[]>([
    {
      id: 1,
      userId,
      weight: 70,
      notes: 'Normal weight',
      datetimeAt: new Date('2025-01-01'),
    },
    {
      id: 2,
      userId,
      weight: 72,
      notes: 'Normal weight',
      datetimeAt: new Date('2025-01-07'),
    },
  ]);

  const [heightList, setHeightList] = useState<Height[]>([
    {
      id: 1,
      userId,
      height: 172,
      notes: 'Normal height',
      datetimeAt: new Date('2025-01-01'),
    },
    {
      id: 2,
      userId,
      height: 172,
      notes: 'Normal height',
      datetimeAt: new Date('2025-01-07'),
    },
  ]);

  const [bloodPressureList, setBloodPressureList] = useState<BloodPressure[]>([
    {
      id: 1,
      userId,
      systolic: 120,
      diastolic: 80,
      notes: 'Normal blood pressure',
      datetimeAt: new Date('2025-01-01'),
    },
    {
      id: 2,
      userId,
      systolic: 130,
      diastolic: 90,
      notes: 'Normal blood pressure',
      datetimeAt: new Date('2025-01-07'),
    },
  ]);

  const [profileSettingsData, setProfileSettingsData] = useState<ProfileSettingsData>({
    birthDate: env.BIRTH_DATE,
    latitude: env.LATITUDE.toString(),
    longitude: env.LONGITUDE.toString(),
    emailNotifications: false,
    dailySummary: false,
    personalHealthData: true,
    userId,
    securitySetup: false,
    salt: '',
    key: '',
  });

  const [profileSecurityData, setProfileSecurityData] = useState<ProfileSecurityData>({
    password: '',
    salt: '',
    key: '',
    userId,
    isInit: false,
  });

  return (
    <ProfileDataContext.Provider
      value={{
        triggerList,
        setTriggerList,
        incidentList,
        setIncidentList,
        medicationList,
        setMedicationList,
        symptomList,
        setSymptomList,
        medicationEnumList,
        setMedicationEnumList,
        symptomEnumList,
        setSymptomEnumList,
        incidentEnumList,
        setIncidentEnumList,
        triggerEnumList,
        setTriggerEnumList,
        weightList,
        setWeightList,
        heightList,
        setHeightList,
        bloodPressureList,
        setBloodPressureList,
        profileSettingsData,
        setProfileSettingsData,
        profileSecurityData,
        setProfileSecurityData,
      }}
    >
      {children}
    </ProfileDataContext.Provider>
  );
};

export const useProfileDataContext = () => {
  const context = useContext(ProfileDataContext);
  if (!context) {
    throw new Error('useProfileDataContext must be used within a ProfileDataProvider');
  }
  return context;
};
