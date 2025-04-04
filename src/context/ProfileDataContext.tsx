import React, { createContext, useState, useContext, ReactNode } from 'react';
import {
  ITrigger,
  Incident,
  Medication,
  Symptom,
  Weight,
  Height,
  BloodPressure,
  ProfileSecurityData,
  IErrorMessage,
  BrokenData,
  ILocationData,
} from '../models/profileData.types';
import { useAuth } from './AuthContext';

interface ProfileDataContextProps {
  triggerList: ITrigger[];
  setTriggerList: React.Dispatch<React.SetStateAction<ITrigger[]>>;
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
  profileSecurityData: ProfileSecurityData;
  setProfileSecurityData: React.Dispatch<React.SetStateAction<ProfileSecurityData>>;
  formErrorMessage: IErrorMessage;
  setFormErrorMessage: React.Dispatch<React.SetStateAction<IErrorMessage>>;
  currentMonth: Date;
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  brokenImportData: BrokenData;
  setBrokenImportData: React.Dispatch<React.SetStateAction<BrokenData>>;
  locationList: ILocationData[];
  setLocationList: React.Dispatch<React.SetStateAction<ILocationData[]>>;
}

const ProfileDataContext = createContext<ProfileDataContextProps | undefined>(undefined);

export const ProfileDataProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const userId: string = user?.id || '1';
  const [triggerList, setTriggerList] = useState<ITrigger[]>([]);
  const [incidentList, setIncidentList] = useState<Incident[]>([]);
  const [medicationList, setMedicationList] = useState<Medication[]>([]);
  const [symptomList, setSymptomList] = useState<Symptom[]>([]);
  const [locationList, setLocationList] = useState<ILocationData[]>([]);

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

  const [weightList, setWeightList] = useState<Weight[]>([]);

  const [heightList, setHeightList] = useState<Height[]>([]);

  const [bloodPressureList, setBloodPressureList] = useState<BloodPressure[]>([]);

  const [profileSecurityData, setProfileSecurityData] = useState<ProfileSecurityData>({
    password: '',
    salt: '',
    key: '',
    userId,
    isInit: false,
  });

  const [formErrorMessage, setFormErrorMessage] = useState<IErrorMessage>({
    showModal: false,
    message: '',
  });

  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const [brokenImportData, setBrokenImportData] = useState<BrokenData>({
    triggers: null,
    incidents: null,
    symptoms: null,
    medications: null,
    locations: null,
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
        profileSecurityData,
        setProfileSecurityData,
        formErrorMessage,
        setFormErrorMessage,
        currentMonth,
        setCurrentMonth,
        brokenImportData,
        setBrokenImportData,
        locationList,
        setLocationList,
      }}
    >
      {children}
    </ProfileDataContext.Provider>
  );
};

export const useProfileDataContext = () => {
  const context = useContext(ProfileDataContext);
  if (context === undefined) {
    throw new Error('useProfileDataContext must be used within a ProfileDataProvider');
  }
  return context;
};
