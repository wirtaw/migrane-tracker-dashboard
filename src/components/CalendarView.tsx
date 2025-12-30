import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import Modal from './../components/Modal';
import { useProfileDataContext } from '../context/ProfileDataContext';
import { getIsoDate } from '../lib/utils';
import { deleteTrigger } from '../services/triggers';
import { deleteSymptom } from '../services/symptoms';
import { deleteMedication } from '../services/medications';
import { deleteIncident } from '../services/incidents';
import { useAuth } from '../context/AuthContext';

interface ICalendarItem {
  id: number | string;
  type: 'Incident' | 'Medication' | 'Trigger' | 'Symptom';
  name: string;
  userId: string;
}

interface IModalContent {
  type: string;
  items: ICalendarItem[];
}

interface ICalendarViewProps {
  weekDays: string[];
  firstDayOfMonth: number;
  days: number[];
}

const CalendarView: React.FC<ICalendarViewProps> = ({ weekDays, firstDayOfMonth, days }) => {
  const [activeModal, setActiveModal] = useState<'details' | null>(null);
  const {
    incidentList,
    medicationList,
    triggerList,
    symptomList,
    currentMonth,
    setCurrentMonth,
    setTriggerList,
    setSymptomList,
    setMedicationList,
    setIncidentList,
  } = useProfileDataContext();
  const { apiSession } = useAuth();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [modalContent, setModalContent] = useState<IModalContent | null>(null);

  const handleDayClick = (date: string) => {
    const incidentItems: ICalendarItem[] = incidentList
      .filter(item => getIsoDate(item.datetimeAt) === date)
      .map(({ id, type, userId }) => ({ id, type: 'Incident', name: type, userId }));
    const medicationItems: ICalendarItem[] = medicationList
      .filter(item => getIsoDate(item.datetimeAt) === date)
      .map(({ id, title, userId }) => ({ id, type: 'Medication', name: title, userId }));
    const triggerItems: ICalendarItem[] = triggerList
      .filter(item => getIsoDate(item.datetimeAt) === date)
      .map(({ id, type, userId }) => ({ id, type: 'Trigger', name: type, userId }));
    const symptomItems: ICalendarItem[] = symptomList
      .filter(item => getIsoDate(item.datetimeAt) === date)
      .map(({ id, type, userId }) => ({ id, type: 'Symptom', name: type, userId }));

    const items: ICalendarItem[] | [] = [
      ...incidentItems,
      ...medicationItems,
      ...triggerItems,
      ...symptomItems,
    ];

    if (items.length > 0) {
      setSelectedDate(date);
      setModalContent({ type: 'Details', items });
    }
    setActiveModal('details');
  };

  const closeModal = () => {
    setSelectedDate(null);
    setModalContent(null);
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));
  };

  const handleDeleteTrigger = async (id: number) => {
    if (!apiSession?.accessToken) return;

    if (window.confirm('Are you sure you want to delete this trigger?')) {
      try {
        await deleteTrigger(id, apiSession.accessToken);
        setTriggerList(prev => prev.filter(t => t.id !== id));
        // Update modal content
        if (modalContent) {
          const updatedItems = modalContent.items.filter(
            item => !(item.type === 'Trigger' && item.id === id)
          );
          if (updatedItems.length === 0) {
            closeModal();
          } else {
            setModalContent({ ...modalContent, items: updatedItems });
          }
        }
      } catch (error) {
        console.error('Failed to delete trigger:', error);
        alert('Failed to delete trigger');
      }
    }
  };

  const handleDeleteSymptom = async (id: string | number) => {
    if (!apiSession?.accessToken) return;
    const symptomId = String(id); // Ensure string for backend

    if (window.confirm('Are you sure you want to delete this symptom?')) {
      try {
        await deleteSymptom(symptomId, apiSession.accessToken);
        setSymptomList(prev => prev.filter(s => s.id.toString() !== symptomId));
        // Update modal content
        if (modalContent) {
          const updatedItems = modalContent.items.filter(
            item => !(item.type === 'Symptom' && String(item.id) === symptomId)
          );
          if (updatedItems.length === 0) {
            closeModal();
          } else {
            setModalContent({ ...modalContent, items: updatedItems });
          }
        }
      } catch (error) {
        console.error('Failed to delete symptom:', error);
        alert('Failed to delete symptom');
      }
    }
  };

  const handleDeleteMedication = async (id: string | number) => {
    if (!apiSession?.accessToken) return;
    const medicationId = String(id);

    if (window.confirm('Are you sure you want to delete this medication?')) {
      try {
        await deleteMedication(medicationId, apiSession.accessToken);
        setMedicationList(prev => prev.filter(m => m.id.toString() !== medicationId));
        // Update modal content
        if (modalContent) {
          const updatedItems = modalContent.items.filter(
            item => !(item.type === 'Medication' && String(item.id) === medicationId)
          );
          if (updatedItems.length === 0) {
            closeModal();
          } else {
            setModalContent({ ...modalContent, items: updatedItems });
          }
        }
      } catch (error) {
        console.error('Failed to delete medication:', error);
        alert('Failed to delete medication');
      }
    }
  };

  const handleDeleteIncident = async (id: string | number) => {
    if (!apiSession?.accessToken) return;
    const incidentId = String(id);

    if (window.confirm('Are you sure you want to delete this incident?')) {
      try {
        await deleteIncident(incidentId, apiSession.accessToken);
        setIncidentList(prev => prev.filter(i => i.id.toString() !== incidentId));
        // Update modal content
        if (modalContent) {
          const updatedItems = modalContent.items.filter(
            item => !(item.type === 'Incident' && String(item.id) === incidentId)
          );
          if (updatedItems.length === 0) {
            closeModal();
          } else {
            setModalContent({ ...modalContent, items: updatedItems });
          }
        }
      } catch (error) {
        console.error('Failed to delete incident:', error);
        alert('Failed to delete incident');
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          <ChevronLeft className="w-5 h-5 dark:text-gray-400" />
        </button>
        <h3 className="text-lg font-semibold dark:text-white">
          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h3>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          <ChevronRight className="w-5 h-5 dark:text-gray-400" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map(day => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-gray-600 dark:text-gray-400 py-2"
          >
            {day}
          </div>
        ))}

        {Array(firstDayOfMonth)
          .fill(null)
          .map((_, index) => (
            <div key={`empty-${index}`} className="h-14" />
          ))}

        {days.map(day => {
          const year = currentMonth.getFullYear();
          const month = currentMonth.getMonth() + 1;
          const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const hasIncident = incidentList.some(item => getIsoDate(item.datetimeAt) === date);
          const hasMedication = medicationList.some(item => getIsoDate(item.datetimeAt) === date);
          const hasTrigger = triggerList.some(item => getIsoDate(item.datetimeAt) === date);
          const hasSymptom = symptomList.some(item => getIsoDate(item.datetimeAt) === date);

          return (
            <div
              key={day}
              className="h-14 border border-gray-100 dark:border-gray-700 rounded-lg p-1 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors cursor-pointer"
              onClick={() => handleDayClick(date)}
            >
              <div className="text-sm dark:text-gray-300">{day}</div>
              <div className="flex justify-center mt-1 space-x-1">
                {hasIncident && <span className="w-2 h-2 bg-red-500 rounded-full" />}
                {hasMedication && <span className="w-2 h-2 bg-blue-500 rounded-full" />}
                {hasTrigger && <span className="w-2 h-2 bg-yellow-500 rounded-full" />}
                {hasSymptom && <span className="w-2 h-2 bg-green-500 rounded-full" />}
              </div>
            </div>
          );
        })}
      </div>

      {modalContent && (
        <Modal
          isOpen={activeModal === 'details'}
          onClose={() => setActiveModal(null)}
          title="Day Details"
        >
          <h2 className="text-lg font-semibold dark:text-white shadow-sm">
            Details for {selectedDate}
          </h2>
          <ul className="mt-4 space-y-2">
            {modalContent.items.map((item, index) => (
              <li
                key={index}
                className="flex items-center justify-between dark:text-white shadow-sm p-2 rounded bg-gray-50 dark:bg-gray-700"
                data-user-id={item.userId}
              >
                <div>
                  <span className="font-medium">{item.type}:</span> {item.name}
                </div>
                {item.type === 'Incident' && (
                  <button
                    onClick={() => handleDeleteIncident(item.id)}
                    className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                {item.type === 'Trigger' && (
                  <button
                    onClick={() => handleDeleteTrigger(item.id as number)}
                    className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                {item.type === 'Symptom' && (
                  <button
                    onClick={() => handleDeleteSymptom(item.id)}
                    className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                {item.type === 'Medication' && (
                  <button
                    onClick={() => handleDeleteMedication(item.id)}
                    className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={closeModal}
              className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Close
            </button>
            <Link
              to={`/date-info?date=${selectedDate}`}
              className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Full information
            </Link>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CalendarView;
