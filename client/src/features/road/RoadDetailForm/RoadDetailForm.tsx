import {
  deleteRoad,
  getRoadById,
  IRoad,
  updateRoad,
} from "@/app/entities/road";
import { CLIENT_ROUTES } from "@/shared/enums/clientRoutes";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/reduxHooks";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import styles from "./RoadDetailForm.module.css";

// Функция для преобразования даты в формат yyyy-MM-dd
const formatDateForInput = (dateString?: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

// Функция для преобразования даты обратно в ISO строку
const parseDateToISO = (dateString: string) => {
  if (!dateString) return '';
  return new Date(dateString).toISOString();
};

export function RoadDetailForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const road = useAppSelector((state) =>
    state.road.road);
const {user} = useAppSelector((state)=>state.user)
  const [editable, setEditable] = useState(false);
  const [formData, setFormData] = useState<Partial<IRoad>>({
    city: '',
    country: '',
    transport: 'машина',
    transportInfo: null,
    routeInfo: '',
    visibility: 'private',
    tripStartDate: '',
    tripEndDate: '',
    accommodation: '',
    checkInDate: '',
    checkOutDate: '',
    visitDates: '',
  });

  useEffect(() => {
    if (id) {
      dispatch(getRoadById({ id: Number(id) }));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (road) {
      // Преобразование всех дат при загрузке
      setFormData({
        ...road,
        tripStartDate: formatDateForInput(road.tripStartDate),
        tripEndDate: formatDateForInput(road.tripEndDate),
        checkInDate: formatDateForInput(road.checkInDate),
        checkOutDate: formatDateForInput(road.checkOutDate),
      
      });
    }
  }, [road]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTransportInfoChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      transportInfo: {
        ...prev.transportInfo,
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    if (id) {
      // Преобразование дат обратно в ISO формат перед отправкой
      const dataToSend = {
        ...formData,
        tripStartDate: parseDateToISO(formData.tripStartDate || ''),
        tripEndDate: parseDateToISO(formData.tripEndDate || ''),
        checkInDate: parseDateToISO(formData.checkInDate || ''),
        checkOutDate: parseDateToISO(formData.checkOutDate || ''),
       
      };
      
      dispatch(updateRoad({ 
        id: Number(id), 
        roadData: dataToSend 
      }));
    }
    setEditable(false);
  };

  const handleDelete = () => {
    if (id) {
      dispatch(deleteRoad({ id: Number(id) }));
      navigate(CLIENT_ROUTES.CABINET_PAGE);
    }
  };

  if (!road) return <p>Загрузка...</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Детали маршрута</h2>
      <div className={styles.formGrid}>
        {/* Страна и город */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Страна</label>
            <input
              type="text"
              name="country"
              className={styles.formInput}
              value={formData.country || ""}
              onChange={handleChange}
              disabled={!editable}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Город</label>
            <input
              type="text"
              name="city"
              className={styles.formInput}
              value={formData.city || ""}
              onChange={handleChange}
              disabled={!editable}
            />
          </div>
        </div>

        {/* Транспорт и информация */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Транспорт</label>
          <select
            name="transport"
            className={styles.formSelect}
            value={formData.transport || ""}
            onChange={handleChange}
            disabled={!editable}
          >
            <option value="поезд">Поезд</option>
            <option value="самолет">Самолет</option>
            <option value="машина">Машина</option>
          </select>
        </div>

        {/* Информация о транспорте */}
        {(formData.transport === 'самолет' || formData.transport === 'поезд') && (
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Дата отправления</label>
              <input
                type="datetime-local"
                value={formData.transportInfo?.departureTime || ''}
                onChange={(e) => 
                  handleTransportInfoChange('departureTime', e.target.value)
                }
                disabled={!editable}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Дата прибытия</label>
              <input
                type="datetime-local"
                value={formData.transportInfo?.arrivalTime || ''}
                onChange={(e) => 
                  handleTransportInfoChange('arrivalTime', e.target.value)
                }
                disabled={!editable}
              />
            </div>
            {formData.transport === 'самолет' && (
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Номер рейса</label>
                <input
                  type="text"
                  value={formData.transportInfo?.flightNumber || ''}
                  onChange={(e) => 
                    handleTransportInfoChange('flightNumber', e.target.value)
                  }
                  disabled={!editable}
                />
              </div>
            )}
          </div>
        )}

        {/* Даты поездки */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Дата начала</label>
            <input
              type="date"
              name="tripStartDate"
              className={styles.formInput}
              value={formData.tripStartDate || ""}
              onChange={handleChange}
              disabled={!editable}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Дата окончания</label>
            <input
              type="date"
              name="tripEndDate"
              className={styles.formInput}
              value={formData.tripEndDate || ""}
              onChange={handleChange}
              disabled={!editable}
            />
          </div>
        </div>

        {/* Информация о жилье */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Название отеля</label>
            <input
              type="text"
              name="accommodation"
              className={styles.formInput}
              value={formData.accommodation || ""}
              onChange={handleChange}
              disabled={!editable}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Дата заезда</label>
            <input
              type="date"
              name="checkInDate"
              className={styles.formInput}
              value={formData.checkInDate || ""}
              onChange={handleChange}
              disabled={!editable}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Дата выезда</label>
            <input
              type="date"
              name="checkOutDate"
              className={styles.formInput}
              value={formData.checkOutDate || ""}
              onChange={handleChange}
              disabled={!editable}
            />
          </div>
        </div>

        {/* Дополнительная информация */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Описание маршрута</label>
          <textarea
            name="routeInfo"
            className={styles.formTextarea}
            value={formData.routeInfo || ""}
            onChange={handleChange}
            disabled={!editable}
            rows={3}
          />
        </div>

        {/* Даты посещения */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Даты посещения</label>
          <input
            type="text-area"
            name="visitDates"
            className={styles.formInput}
            value={formData.visitDates}
            onChange={(e) => 
              setFormData(prev => ({
                ...prev,
                visitDates: e.target.value})
              )
            }
            disabled={!editable}
            placeholder="Введите даты через запятую (гггг-мм-дд)"
          />
        </div>

        {/* Видимость */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Видимость</label>
          <select
            name="visibility"
            className={styles.formSelect}
            value={formData.visibility || "private"}
            onChange={handleChange}
            disabled={!editable}
          >
            <option value="private">Приватный</option>
            <option value="friends">Для друзей</option>
            <option value="public">Публичный</option>
          </select>
        </div>
      </div>

      

      {/* Кнопки управления */}
      {road?.author?.id === user?.id && (<div className={styles.buttonGroup}>
        <button
          type="button"
          className={`${styles.button} ${styles.buttonPrimary}`}
          onClick={() => setEditable(!editable)}
        >
          {editable ? "Отменить редактирование" : "Редактировать"}
        </button>
        
        {editable && (
          <button
            type="button"
            className={`${styles.button} ${styles.buttonSuccess}`}
            onClick={handleSave}
          >
            Сохранить изменения
          </button>
        )}
        
        <button
          type="button"
          className={`${styles.button} ${styles.buttonDanger}`}
          onClick={handleDelete}
        >
          Удалить маршрут
        </button>
      </div>)}
    </div>
  );
}