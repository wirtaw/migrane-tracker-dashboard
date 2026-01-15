import React, { createContext, useState, useContext, ReactNode } from 'react';
import {
  ITrigger,
  IIncident,
  IMedication,
  ISymptom,
  IWeight,
  IHeight,
  IBloodPressure,
  ProfileSecurityData,
  IErrorMessage,
  IBrokenData,
  ILocationData,
  ITyramineContentItem,
} from '../models/profileData.types';
import { fetchTriggers } from '../services/triggers';
import { fetchSymptoms } from '../services/symptoms';
import { fetchMedications } from '../services/medications';
import { fetchHeights, fetchWeights, fetchBloodPressures } from '../services/health-logs';
import { fetchIncidents } from '../services/incidents';
import { LocationsService } from '../services/locations';
import { useAuth } from './AuthContext';

interface IProfileDataContextProps {
  triggerList: ITrigger[];
  setTriggerList: React.Dispatch<React.SetStateAction<ITrigger[]>>;
  incidentList: IIncident[];
  setIncidentList: React.Dispatch<React.SetStateAction<IIncident[]>>;
  medicationList: IMedication[];
  setMedicationList: React.Dispatch<React.SetStateAction<IMedication[]>>;
  symptomList: ISymptom[];
  setSymptomList: React.Dispatch<React.SetStateAction<ISymptom[]>>;
  medicationEnumList: string[];
  setMedicationEnumList: React.Dispatch<React.SetStateAction<string[]>>;
  symptomEnumList: string[];
  setSymptomEnumList: React.Dispatch<React.SetStateAction<string[]>>;
  incidentEnumList: string[];
  setIncidentEnumList: React.Dispatch<React.SetStateAction<string[]>>;
  triggerEnumList: string[];
  setTriggerEnumList: React.Dispatch<React.SetStateAction<string[]>>;
  weightList: IWeight[];
  setWeightList: React.Dispatch<React.SetStateAction<IWeight[]>>;
  heightList: IHeight[];
  setHeightList: React.Dispatch<React.SetStateAction<IHeight[]>>;
  bloodPressureList: IBloodPressure[];
  setBloodPressureList: React.Dispatch<React.SetStateAction<IBloodPressure[]>>;
  profileSecurityData: ProfileSecurityData;
  setProfileSecurityData: React.Dispatch<React.SetStateAction<ProfileSecurityData>>;
  formErrorMessage: IErrorMessage;
  setFormErrorMessage: React.Dispatch<React.SetStateAction<IErrorMessage>>;
  currentMonth: Date;
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  brokenImportData: IBrokenData;
  setBrokenImportData: React.Dispatch<React.SetStateAction<IBrokenData>>;
  locationList: ILocationData[];
  setLocationList: React.Dispatch<React.SetStateAction<ILocationData[]>>;
  recommendationList: string[];
  reducedTyramineMenuList: ITyramineContentItem[];
}

const ProfileDataContext = createContext<IProfileDataContextProps | undefined>(undefined);

export const ProfileDataProvider = ({ children }: { children: ReactNode }) => {
  const { user, apiSession } = useAuth();
  const userId: string = user?.id || '1';
  const [triggerList, setTriggerList] = useState<ITrigger[]>([]);
  const [incidentList, setIncidentList] = useState<IIncident[]>([]);
  const [medicationList, setMedicationList] = useState<IMedication[]>([]);
  const [symptomList, setSymptomList] = useState<ISymptom[]>([]);
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

  const [weightList, setWeightList] = useState<IWeight[]>([]);

  const [heightList, setHeightList] = useState<IHeight[]>([]);

  const [bloodPressureList, setBloodPressureList] = useState<IBloodPressure[]>([]);

  const [profileSecurityData, setProfileSecurityData] = useState<ProfileSecurityData>({
    password: '',
    userId,
    isInit: false,
  });

  const [formErrorMessage, setFormErrorMessage] = useState<IErrorMessage>({
    showModal: false,
    message: '',
  });

  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const [brokenImportData, setBrokenImportData] = useState<IBrokenData>({
    triggers: null,
    incidents: null,
    symptoms: null,
    medications: null,
    locations: null,
  });

  const [recommendationList] = useState<string[]>([
    'Avoid or significantly limit the consumption of foods containing tyramine (see table on the reverse side).',
    'Avoid dieting and long intervals between meals.',
    'Limit alcohol consumption, especially red wine.',
    'Quit smoking.',
    'Avoid physical overexertion and sudden lifestyle changes.',
    'Increase physical activity (e.g., walking for up to 45 minutes at least 4 times a week).',
    'Normalize your sleep schedule (both insufficient and excessive sleep can be harmful).',
    'Try to avoid stressful situations (e.g., during an argument, simply leave the room instead of engaging in conflict).',
    'Avoid using hormonal contraceptives if possible.',
    'Ensure proper treatment of comorbid conditions (primarily arterial hypertension).',
    'Maintain adequate magnesium intake levels.',
    'Limit exposure to sources of bright light (computer monitors, television screens, sunlight), strong odors (perfume), and loud noises.',
    'Do not self-medicate—migraine is a serious neurological condition. If the frequency or severity of attacks increases, consult your healthcare provider immediately.',
  ]);

  const [reducedTyramineMenuList] = useState<ITyramineContentItem[]>([
    {
      product: 'Drinks',
      allowedUse: 'Decaffeinated coffee, fruit juices, sodas, carbonated drinks without caffeine.',
      limitedUse:
        'Coffee and tea no more than twice a day (1 cup), caffeinated sodas, hot chocolate.',
      striclyProhibitedUse: 'Alcoholic drinks: sherry, vermouth, beer, wine. Non-alcoholic beer.',
    },
    {
      product: 'Meat, Fish, Poultry, Eggs',
      allowedUse: 'Freshly prepared steamed or boiled meat, poultry, fresh fish, fresh eggs.',
      limitedUse: 'Bacon, sausages, hot dogs, smoked meat, caviar.',
      striclyProhibitedUse:
        'Preserved and canned products: marinated meat, smoked fish and meat. Liver.',
    },
    {
      product: 'Dairy Products',
      allowedUse: 'Whole milk (2% fat or less), mild cheese, processed cheese.',
      limitedUse: 'Parmesan cheese, yogurt, sour cream – no more than 1/2 cup per day.',
      striclyProhibitedUse: 'Long-aged cheeses.',
    },
    {
      product: 'Bakery Products',
      allowedUse: 'Yeast-free bread and factory-made baked goods (e.g., tomato bread).',
      limitedUse: 'Homemade yeast bread (1 slice per day).',
      striclyProhibitedUse: 'Any baked goods with additives.',
    },
    {
      product: 'Vegetables',
      allowedUse:
        'Asparagus, carrots, spinach, tomatoes, boiled or fried onions, potatoes, zucchini, legumes, pumpkin, beets.',
      limitedUse: 'Fresh onions.',
      striclyProhibitedUse: 'Canned and marinated soy products and legumes. Soy sauce.',
    },
    {
      product: 'Fruits',
      allowedUse: 'Apples, pears, cherries, peaches, apricots.',
      limitedUse:
        'No more than 1/2 cup per day: citrus fruits (oranges, tangerines, grapefruits, pineapples, lemons). Avocadoes, bananas, dates, figs, red plums with raisins.',
      striclyProhibitedUse: 'None.',
    },
    {
      product: 'Nuts and Grains',
      allowedUse: 'None.',
      limitedUse: 'None.',
      striclyProhibitedUse: 'All nuts and grains.',
    },
    {
      product: 'Soups',
      allowedUse: 'Homemade soups.',
      limitedUse:
        'Soups containing yeast extract or monosodium glutamate (e.g., Chinese cuisine), meat broths.',
      striclyProhibitedUse: 'None.',
    },
    {
      product: 'Desserts and Sweets',
      allowedUse: 'Sugar, honey, cakes, cookies, jams, jelly, candies.',
      limitedUse: 'Chocolate-containing products: ice cream (1 cup), chocolate candies (15 grams).',
      striclyProhibitedUse: 'Meat-filled pastries.',
    },
    {
      product: 'Spices',
      allowedUse: 'Any.',
      limitedUse: 'None.',
      striclyProhibitedUse: 'None.',
    },
  ]);

  React.useEffect(() => {
    if (apiSession?.accessToken) {
      // Fetch Triggers
      fetchTriggers(apiSession.accessToken)
        .then(data => {
          setTriggerList(data);
          const historyTypes = Array.from(new Set(data.map(t => t.type)));
          setTriggerEnumList(prev => {
            const uniqueTypes = new Set([...prev, ...historyTypes]);
            return Array.from(uniqueTypes);
          });
        })
        .catch(err => console.error('Failed to fetch triggers', err));

      // Fetch Symptoms
      fetchSymptoms(apiSession.accessToken)
        .then(data => {
          setSymptomList(data);
          const historyTypes = Array.from(new Set(data.map(s => s.type)));
          setSymptomEnumList(prev => {
            const uniqueTypes = new Set([...prev, ...historyTypes]);
            return Array.from(uniqueTypes);
          });
        })
        .catch(err => console.error('Failed to fetch symptoms', err));

      // Fetch Medications
      fetchMedications(apiSession.accessToken)
        .then(data => {
          setMedicationList(data);
          const historyTitles = Array.from(new Set(data.map(m => m.title)));
          setMedicationEnumList(prev => {
            const uniqueTitles = new Set([...prev, ...historyTitles]);
            return Array.from(uniqueTitles);
          });
        })
        .catch(err => console.error('Failed to fetch medications', err));

      // Fetch Health Logs
      fetchHeights(apiSession.accessToken)
        .then(setHeightList)
        .catch(err => console.error('Failed to fetch heights', err));

      fetchWeights(apiSession.accessToken)
        .then(setWeightList)
        .catch(err => console.error('Failed to fetch weights', err));

      fetchBloodPressures(apiSession.accessToken)
        .then(setBloodPressureList)
        .catch(err => console.error('Failed to fetch blood pressures', err));

      fetchIncidents(apiSession.accessToken)
        .then(setIncidentList)
        .catch(err => console.error('Failed to fetch incidents', err));

      LocationsService.getLocations(apiSession.accessToken)
        .then(setLocationList)
        .catch(err => console.error('Failed to fetch locations', err));
    }
  }, [apiSession?.accessToken]);

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
        recommendationList,
        reducedTyramineMenuList,
      }}
    >
      {children}
    </ProfileDataContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useProfileDataContext = () => {
  const context = useContext(ProfileDataContext);
  if (context === undefined) {
    throw new Error('useProfileDataContext must be used within a ProfileDataProvider');
  }
  return context;
};
