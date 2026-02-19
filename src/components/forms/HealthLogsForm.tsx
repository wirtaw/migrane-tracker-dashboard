import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useProfileDataContext } from '../../context/ProfileDataContext';
import { getIsoDateTimeLocal, getIsoDate } from '../../lib/utils';
import {
  createHeight,
  createWeight,
  createBloodPressure,
  createSleep,
  createWater,
  deleteHeight,
  deleteWeight,
  deleteBloodPressure,
  deleteSleep,
  deleteWater,
  CreateHeightDto,
  CreateWeightDto,
  CreateBloodPressureDto,
  CreateSleepDto,
  CreateWaterDto,
  updateHeight,
  updateWeight,
  updateBloodPressure,
  updateSleep,
  updateWater,
  UpdateHeightDto,
  UpdateWeightDto,
  UpdateBloodPressureDto,
  UpdateSleepDto,
  UpdateWaterDto,
} from '../../services/health-logs';
import { IHeight, IWeight, IBloodPressure, ISleep, IWater } from '../../models/profileData.types';
import { Trash2 } from 'lucide-react';

interface IHealthLogsFormProps {
  onSubmit: () => void;
  initialType?: 'height' | 'weight' | 'bloodPressure' | 'sleep' | 'water';
  initialData?: IHeight | IWeight | IBloodPressure | ISleep | IWater;
}

export default function HealthLogsForm({
  onSubmit,
  initialType = 'weight',
  initialData,
}: IHealthLogsFormProps) {
  const { apiSession } = useAuth();
  const {
    heightList,
    setHeightList,
    weightList,
    setWeightList,
    bloodPressureList,
    setBloodPressureList,
    sleepList,
    setSleepList,
    waterList,
    setWaterList,
    setFormErrorMessage,
  } = useProfileDataContext();

  type TabType = 'height' | 'weight' | 'bloodPressure' | 'sleep' | 'water';

  const [activeTab, setActiveTab] = useState<TabType>(initialType);
  const [datetime, setDatetime] = useState<Date>(
    initialData?.datetimeAt ? new Date(initialData.datetimeAt) : new Date()
  );
  const [notes, setNotes] = useState(initialData?.notes || '');

  // Values
  const [heightValue, setHeightValue] = useState<string>(
    initialData && 'height' in initialData ? String(initialData.height) : ''
  );
  const [weightValue, setWeightValue] = useState<string>(
    initialData && 'weight' in initialData ? String(initialData.weight) : ''
  );
  const [systolicValue, setSystolicValue] = useState<string>(
    initialData && 'systolic' in initialData ? String(initialData.systolic) : ''
  );
  const [diastolicValue, setDiastolicValue] = useState<string>(
    initialData && 'diastolic' in initialData ? String(initialData.diastolic) : ''
  );

  // Sleep Values
  const [sleepRate, setSleepRate] = useState<string>(
    initialData && 'rate' in initialData ? String(initialData.rate || '') : ''
  );
  const [minutesTotal, setMinutesTotal] = useState<string>(
    initialData && 'minutesTotal' in initialData ? String(initialData.minutesTotal || '') : ''
  );
  const [minutesDeep, setMinutesDeep] = useState<string>(
    initialData && 'minutesDeep' in initialData ? String(initialData.minutesDeep || '') : ''
  );
  const [minutesRem, setMinutesRem] = useState<string>(
    initialData && 'minutesRem' in initialData ? String(initialData.minutesRem || '') : ''
  );
  const [timesWakeUp, setTimesWakeUp] = useState<string>(
    initialData && 'timesWakeUp' in initialData ? String(initialData.timesWakeUp ?? '') : ''
  );
  const [startedAt, setStartedAt] = useState<string>(
    initialData && 'startedAt' in initialData && initialData.startedAt
      ? getIsoDateTimeLocal(new Date(initialData.startedAt))
      : ''
  );

  // Water Values
  const [waterMlValue, setWaterMlValue] = useState<string>(
    initialData && 'ml' in initialData ? String(initialData.ml) : ''
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!apiSession?.accessToken || !apiSession?.userId) {
      setFormErrorMessage({ showModal: true, message: 'Authentication required' });
      return;
    }

    const promises: Promise<unknown>[] = [];

    try {
      if (initialData) {
        // Edit Mode
        if (activeTab === 'weight' && weightValue) {
          const dto: UpdateWeightDto = {
            weight: parseFloat(weightValue),
            notes,
            datetimeAt: datetime.toISOString(),
          };
          const p = updateWeight(initialData.id, dto, apiSession.accessToken).then(data => {
            setWeightList(prev => prev.map(item => (item.id === data.id ? data : item)));
          });
          promises.push(p);
        } else if (activeTab === 'height' && heightValue) {
          const dto: UpdateHeightDto = {
            height: parseFloat(heightValue),
            notes,
            datetimeAt: datetime.toISOString(),
          };
          const p = updateHeight(initialData.id, dto, apiSession.accessToken).then(data => {
            setHeightList(prev => prev.map(item => (item.id === data.id ? data : item)));
          });
          promises.push(p);
        } else if (activeTab === 'bloodPressure' && systolicValue && diastolicValue) {
          const dto: UpdateBloodPressureDto = {
            systolic: parseFloat(systolicValue),
            diastolic: parseFloat(diastolicValue),
            notes,
            datetimeAt: datetime.toISOString(),
          };
          const p = updateBloodPressure(initialData.id, dto, apiSession.accessToken).then(data => {
            setBloodPressureList(prev => prev.map(item => (item.id === data.id ? data : item)));
          });
          promises.push(p);
        } else if (activeTab === 'sleep') {
          const dto: UpdateSleepDto = {
            rate: sleepRate ? parseInt(sleepRate) : undefined,
            minutesTotal: minutesTotal ? parseInt(minutesTotal) : undefined,
            minutesDeep: minutesDeep ? parseInt(minutesDeep) : undefined,
            minutesRem: minutesRem ? parseInt(minutesRem) : undefined,
            timesWakeUp: timesWakeUp ? parseInt(timesWakeUp) : undefined,
            startedAt: startedAt ? new Date(startedAt).toISOString() : undefined,
            notes,
            datetimeAt: datetime.toISOString(),
          };
          const p = updateSleep(initialData.id, dto, apiSession.accessToken).then(data => {
            setSleepList(prev => prev.map(item => (item.id === data.id ? data : item)));
          });
          promises.push(p);
        } else if (activeTab === 'water' && waterMlValue) {
          const dto: UpdateWaterDto = {
            ml: parseFloat(waterMlValue),
            notes,
            datetimeAt: datetime.toISOString(),
          };
          const p = updateWater(initialData.id, dto, apiSession.accessToken).then(data => {
            setWaterList(prev => prev.map(item => (item.id === data.id ? data : item)));
          });
          promises.push(p);
        }
      } else {
        // Create Mode
        // Weight
        if (activeTab === 'weight' && weightValue) {
          const dto: CreateWeightDto = {
            userId: apiSession.userId,
            weight: parseFloat(weightValue),
            notes,
            datetimeAt: datetime.toISOString(),
          };
          const promise = createWeight(dto, apiSession.accessToken).then(data => {
            setWeightList(prev => [...prev, data]);
            return 'weight';
          });
          promises.push(promise);
        }

        // Height
        if (activeTab === 'height' && heightValue) {
          const dto: CreateHeightDto = {
            userId: apiSession.userId,
            height: parseFloat(heightValue),
            notes,
            datetimeAt: datetime.toISOString(),
          };
          const promise = createHeight(dto, apiSession.accessToken).then(data => {
            setHeightList(prev => [...prev, data]);
            return 'height';
          });
          promises.push(promise);
        }

        // Blood Pressure
        if (activeTab === 'bloodPressure' && systolicValue && diastolicValue) {
          const dto: CreateBloodPressureDto = {
            userId: apiSession.userId,
            systolic: parseFloat(systolicValue),
            diastolic: parseFloat(diastolicValue),
            notes,
            datetimeAt: datetime.toISOString(),
          };
          const promise = createBloodPressure(dto, apiSession.accessToken).then(data => {
            setBloodPressureList(prev => [...prev, data]);
            return 'bloodPressure';
          });
          promises.push(promise);
        }

        // Sleep
        if (activeTab === 'sleep') {
          const dto: CreateSleepDto = {
            userId: apiSession.userId,
            rate: sleepRate ? parseInt(sleepRate) : undefined,
            minutesTotal: minutesTotal ? parseInt(minutesTotal) : undefined,
            minutesDeep: minutesDeep ? parseInt(minutesDeep) : undefined,
            minutesRem: minutesRem ? parseInt(minutesRem) : undefined,
            timesWakeUp: timesWakeUp ? parseInt(timesWakeUp) : undefined,
            startedAt: startedAt ? new Date(startedAt).toISOString() : undefined,
            notes,
            datetimeAt: datetime.toISOString(),
          };
          const promise = createSleep(dto, apiSession.accessToken).then(data => {
            setSleepList(prev => [...prev, data]);
            return 'sleep';
          });
          promises.push(promise);
        }

        // Water
        if (activeTab === 'water' && waterMlValue) {
          const dto: CreateWaterDto = {
            userId: apiSession.userId,
            ml: parseFloat(waterMlValue),
            notes,
            datetimeAt: datetime.toISOString(),
          };
          const promise = createWater(dto, apiSession.accessToken).then(data => {
            setWaterList(prev => [...prev, data]);
            return 'water';
          });
          promises.push(promise);
        }
      }

      if (promises.length === 0) {
        setFormErrorMessage({ showModal: true, message: 'No data entered to save' });
        return;
      }

      await Promise.all(promises);
      onSubmit();
    } catch (error) {
      console.error('Failed to save health logs:', error);
      setFormErrorMessage({
        showModal: true,
        message: error instanceof Error ? error.message : 'Failed to save one or more health logs',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!apiSession?.accessToken) return;
    if (!window.confirm('Are you sure you want to delete this log?')) return;

    try {
      if (activeTab === 'weight') {
        await deleteWeight(id, apiSession.accessToken);
        setWeightList(prev => prev.filter(item => item.id !== id));
      } else if (activeTab === 'height') {
        await deleteHeight(id, apiSession.accessToken);
        setHeightList(prev => prev.filter(item => item.id !== id));
      } else if (activeTab === 'bloodPressure') {
        await deleteBloodPressure(id, apiSession.accessToken);
        setBloodPressureList(prev => prev.filter(item => item.id !== id));
      } else if (activeTab === 'sleep') {
        await deleteSleep(id, apiSession.accessToken);
        setSleepList(prev => prev.filter(item => item.id !== id));
      } else if (activeTab === 'water') {
        await deleteWater(id, apiSession.accessToken);
        setWaterList(prev => prev.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error(`Failed to delete ${activeTab}:`, error);
      setFormErrorMessage({ showModal: true, message: 'Failed to delete item' });
    }
  };

  const tabs = [
    { id: 'weight', label: 'Weight' },
    { id: 'height', label: 'Height' },
    { id: 'bloodPressure', label: 'Blood Pressure' },
    { id: 'sleep', label: 'Sleep' },
    { id: 'water', label: 'Water' },
  ];

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700 pb-2 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            DateTime / Wake up time
          </label>
          <input
            type="datetime-local"
            value={getIsoDateTimeLocal(datetime)}
            onChange={e => setDatetime(new Date(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
            required
          />
        </div>

        {activeTab === 'weight' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Weight (kg)
            </label>
            <input
              type="number"
              step="0.1"
              value={weightValue}
              onChange={e => setWeightValue(e.target.value)}
              onFocus={e => e.target.select()}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
            />
          </div>
        )}

        {activeTab === 'height' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Height (cm)
            </label>
            <input
              type="number"
              step="0.1"
              value={heightValue}
              onChange={e => setHeightValue(e.target.value)}
              onFocus={e => e.target.select()}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
            />
          </div>
        )}

        {activeTab === 'bloodPressure' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Systolic
              </label>
              <input
                type="number"
                value={systolicValue}
                onChange={e => setSystolicValue(e.target.value)}
                onFocus={e => e.target.select()}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Diastolic
              </label>
              <input
                type="number"
                value={diastolicValue}
                onChange={e => setDiastolicValue(e.target.value)}
                onFocus={e => e.target.select()}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
              />
            </div>
          </div>
        )}

        {activeTab === 'sleep' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Started Sleeping
              </label>
              <input
                type="datetime-local"
                value={startedAt}
                onChange={e => setStartedAt(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Total Minutes
                </label>
                <input
                  type="number"
                  value={minutesTotal}
                  onChange={e => setMinutesTotal(e.target.value)}
                  onFocus={e => e.target.select()}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Wake Ups
                </label>
                <input
                  type="number"
                  value={timesWakeUp}
                  onChange={e => setTimesWakeUp(e.target.value)}
                  onFocus={e => e.target.select()}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Deep Sleep (min)
                </label>
                <input
                  type="number"
                  value={minutesDeep}
                  onChange={e => setMinutesDeep(e.target.value)}
                  onFocus={e => e.target.select()}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  REM Sleep (min)
                </label>
                <input
                  type="number"
                  value={minutesRem}
                  onChange={e => setMinutesRem(e.target.value)}
                  onFocus={e => e.target.select()}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Rate (1-10)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={sleepRate}
                onChange={e => setSleepRate(e.target.value)}
                onFocus={e => e.target.select()}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
              />
            </div>
          </div>
        )}

        {activeTab === 'water' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Water (ml)
            </label>
            <input
              type="number"
              value={waterMlValue}
              onChange={e => setWaterMlValue(e.target.value)}
              onFocus={e => e.target.select()}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
            rows={2}
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save
          </button>
        </div>
      </form>

      {/* List of existing items */}
      <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">History</h3>
        <div className="max-h-48 overflow-y-auto space-y-2">
          {activeTab === 'weight' &&
            weightList.map((item: IWeight) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md"
              >
                <div className="text-sm dark:text-gray-300">
                  <span className="font-medium">{item.weight} kg</span>
                  <span className="text-gray-500 dark:text-gray-500 ml-2">
                    {getIsoDate(item.datetimeAt)}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

          {activeTab === 'height' &&
            heightList.map((item: IHeight) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md"
              >
                <div className="text-sm dark:text-gray-300">
                  <span className="font-medium">{item.height} cm</span>
                  <span className="text-gray-500 dark:text-gray-500 ml-2">
                    {getIsoDate(item.datetimeAt)}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

          {activeTab === 'bloodPressure' &&
            bloodPressureList.map((item: IBloodPressure) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md"
              >
                <div className="text-sm dark:text-gray-300">
                  <span className="font-medium">
                    {item.systolic}/{item.diastolic}
                  </span>
                  <span className="text-gray-500 dark:text-gray-500 ml-2">
                    {getIsoDate(item.datetimeAt)}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

          {activeTab === 'sleep' &&
            sleepList.map((item: ISleep) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md"
              >
                <div className="text-sm dark:text-gray-300">
                  <span className="font-medium">
                    {item.minutesTotal
                      ? Math.floor(item.minutesTotal / 60) + 'h ' + (item.minutesTotal % 60) + 'm'
                      : 'Sleep log'}
                  </span>
                  <span className="text-gray-500 dark:text-gray-500 ml-2">
                    {getIsoDate(item.datetimeAt)}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

          {activeTab === 'water' &&
            waterList.map((item: IWater) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md"
              >
                <div className="text-sm dark:text-gray-300">
                  <span className="font-medium">{item.ml} ml</span>
                  <span className="text-gray-500 dark:text-gray-500 ml-2">
                    {getIsoDate(item.datetimeAt)}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
