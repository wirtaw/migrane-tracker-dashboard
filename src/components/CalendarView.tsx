import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Modal from './../components/Modal';
import { useProfileDataContext } from '../context/ProfileDataContext';
import { getIsoDate } from '../lib/utils.ts';

interface CalendarItem {
  type: 'Incident' | 'Medication' | 'Trigger';
  name: string;
  userId: string;
}

interface ModalContent {
  type: string;
  items: CalendarItem[];
}

interface CalendarViewProps {
  weekDays: string[];
  firstDayOfMonth: number;
  days: number[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ weekDays, firstDayOfMonth, days }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [activeModal, setActiveModal] = useState<'details' | null>(null);
  const { incidentList, medicationList, triggerList } = useProfileDataContext();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [modalContent, setModalContent] = useState<ModalContent | null>(null);

  const handleDayClick = (date: string) => {
    const incidentItems: CalendarItem[] = incidentList
      .filter(item => getIsoDate(item.datetimeAt) === date)
      .map(({ type, userId }) => ({ type: 'Incident', name: type, userId }));
    const medicationItems: CalendarItem[] = medicationList
      .filter(item => getIsoDate(item.datetimeAt) === date)
      .map(({ title, userId }) => ({ type: 'Medication', name: title, userId }));
    const triggerItems: CalendarItem[] = triggerList
      .filter(item => getIsoDate(item.datetimeAt) === date)
      .map(({ type, userId }) => ({ type: 'Trigger', name: type, userId }));

    const items: CalendarItem[] | [] = [...incidentItems, ...medicationItems, ...triggerItems];

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
              </div>
            </div>
          );
        })}
      </div>

      {modalContent && (
        <Modal
          isOpen={activeModal === 'details'}
          onClose={() => setActiveModal(null)}
          title="Details Modal"
        >
          <h2 className="text-lg font-semibold dark:text-white shadow-sm">
            Details for {selectedDate}
          </h2>
          <ul className="mt-4">
            {modalContent.items.map((item, index) => (
              <li key={index} className="mt-2 dark:text-white shadow-sm" data-user-id={item.userId}>
                <span className="font-medium">{item.type}:</span> {item.name}
              </li>
            ))}
          </ul>
          <button
            onClick={closeModal}
            className="mt-4 inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </Modal>
      )}
    </div>
  );
};

export default CalendarView;
