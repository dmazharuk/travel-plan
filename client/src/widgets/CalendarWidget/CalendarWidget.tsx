
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './CalendarWidget.module.css'; 

interface CalendarWidgetProps {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (dates: [Date | null, Date | null]) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export function CalendarWidget({
  startDate,
  endDate,
  onChange,
  onClose,
  onConfirm,
}: CalendarWidgetProps) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      {' '}
      {/* Оверлей, закрывает календарь при клике вне его */}
      <div className={styles.calendarModal} onClick={(e) => e.stopPropagation()}>
        {' '}
        {/* Останавливаем всплытие события */}
        <div className={styles.calendarWidget}>
          <DatePicker
            selected={startDate}
            onChange={(dates) => {
              onChange(dates);
            }}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            inline
          />
        </div>
        <button onClick={onClose} className={styles.closeButton}>
          Закрыть
        </button>
        <button onClick={onConfirm} className={styles.closeButton}>
          создать маршрут
        </button>
      </div>
    </div>
  );
}