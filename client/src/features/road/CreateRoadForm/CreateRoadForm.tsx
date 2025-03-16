import { useState, useEffect } from 'react';
import { useAppDispatch } from '@/shared/hooks/reduxHooks';
import { useNavigate, useParams } from 'react-router';
import {
  createRoad,
  updateRoad,
  IRoadRowData,
  getRoadById,
  
} from '@/app/entities/road';
import styles from './CreateRoadForm.module.css';

// Определение начальных данных для формы
const initialFormData: IRoadRowData = {
  country: '',
  city: '',
  transport: 'машина', // Начальное значение
  transportInfo: null, // Изначально транспортная информация отсутствует
  routeInfo: '',
  visibility: 'private',
  tripStartDate: '',
  tripEndDate: '',
  accommodation: '',
  checkInDate: '',
  checkOutDate: '',
  visitDates: '',
};

export function CreateRoadForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams(); 
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<IRoadRowData>(initialFormData);

  // Загрузка данных для редактирования
  useEffect(() => {
    if (isEditMode) {
      const fetchRoadData = async () => {
        const response = await dispatch(getRoadById({ id: Number(id) }));
        if (response.payload?.data) {
          const roadData = response.payload.data;
          setFormData({
            city: roadData.city,
            country: roadData.country,
            transport: roadData.transport,
            transportInfo: roadData.transportInfo,
            routeInfo: roadData.routeInfo,
            visibility: roadData.visibility,
            tripStartDate: roadData.tripStartDate,
            tripEndDate: roadData.tripEndDate,
            accommodation: roadData.accommodation,
            checkInDate: roadData.checkInDate,
            checkOutDate: roadData.checkOutDate,
            visitDates: roadData.visitDates,
          });
        }
      };
      fetchRoadData();
    }
  }, [id, dispatch]);

  
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  // Обработчик изменений для выбора транспорта
  const handleTransportChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      transport: value as 'поезд' | 'самолет' | 'машина',
      transportInfo:
        value === 'машина'
          ? null
          : {
              departureTime: '',
              arrivalTime: '',
              flightNumber: value === 'самолет' ? '' : undefined,
            },
    }));
  };

  const handleTransportInfoChange = (field: string, value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      transportInfo: {
        ...prevState.transportInfo,
        [field]: value,
      },
    }));
  };

  // Обработчик отправки формы
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("=====>",formData);
    
    try {
      if (isEditMode) {
        // Обновление маршрута
        await dispatch(updateRoad({ id: Number(id), roadData: formData })).unwrap();
      } else {
        // Создание нового маршрута
        await dispatch(createRoad(formData)).unwrap();
      }
      navigate('/cabinet');
    } catch (error) {
      console.error('Ошибка при сохранении маршрута', error);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h1 className={styles.formTitle}>
        {isEditMode ? 'Редактировать маршрут' : 'Создать новый маршрут'}
      </h1>
      <form onSubmit={handleSubmit} className={styles.formGrid}>
        {/* Город и страна в одной строке */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="city" className={styles.formLabel}>
              Город
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={styles.formInput}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="country" className={styles.formLabel}>
              Страна
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className={styles.formInput}
              required
            />
          </div>
        </div>

        {/* Транспорт */}
        <div className={styles.formGroup}>
          <label htmlFor="transport" className={styles.formLabel}>
            Транспорт
          </label>
          <select
            id="transport"
            name="transport"
            value={formData.transport}
            onChange={handleTransportChange}
            className={styles.formInput}
            required
          >
            <option value="поезд">Поезд</option>
            <option value="самолет">Самолет</option>
            <option value="машина">Машина</option>
          </select>
        </div>

        {/* Дополнительные поля для транспорта */}

        {(formData.transport === 'самолет' || formData.transport === 'поезд') && (
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="departureTime">Время отправления</label>
              <input
                type="datetime-local"
                id="departureTime"
                value={formData.transportInfo?.departureTime || ''}
                onChange={(e) =>
                  handleTransportInfoChange('departureTime', e.target.value)
                 
                  
                }
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="arrivalTime">Время прибытия</label>
              <input
                type="datetime-local"
                id="arrivalTime"
                value={formData.transportInfo?.arrivalTime || ''}
                onChange={(e) => handleTransportInfoChange('arrivalTime', e.target.value)}
                required
              />
            </div>
            {formData.transport === 'самолет' && (
              <div className={styles.formGroup}>
                <label htmlFor="flightNumber">Номер рейса</label>
                <input
                  type="text"
                  id="flightNumber"
                  value={formData.transportInfo?.flightNumber || ''}
                  onChange={(e) =>
                    handleTransportInfoChange('flightNumber', e.target.value)
                  }
                  required
                />
              </div>
            )}
          </div>
        )}

        {/* Для маршрута на машине */}
        {formData.transport === 'машина' && (
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="tripStartDate" className={styles.formLabel}>
                Дата начала
              </label>
              <input
                type="date"
                name="tripStartDate"
                value={formData.tripStartDate}
                onChange={handleChange}
                className={styles.formInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="tripEndDate" className={styles.formLabel}>
                Дата окончания
              </label>
              <input
                type="date"
                name="tripEndDate"
                value={formData.tripEndDate}
                onChange={handleChange}
                className={styles.formInput}
              />
            </div>
          </div>
        )}

        {/* Информация о маршруте */}
        <div className={styles.formGroup}>
          <label htmlFor="routeInfo" className={styles.formLabel}>
            Информация о маршруте
          </label>
          <textarea
            id="routeInfo"
            name="routeInfo"
            value={formData.routeInfo || ''}
            onChange={handleChange}
            className={styles.formInput}
            rows={2}
          />
        </div>

        {/* Жилье */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="accommodation" className={styles.formLabel}>
              Название отеля
            </label>
            <input
              type="text"
              id="accommodation"
              name="accommodation"
              value={formData.accommodation || ''}
              onChange={handleChange}
              className={styles.formInput}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="checkInDate" className={styles.formLabel}>
              Дата заезда
            </label>
            <input
              type="date"
              id="checkInDate"
              name="checkInDate"
              value={formData.checkInDate || ''}
              onChange={handleChange}
              className={styles.formInput}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="checkOutDate" className={styles.formLabel}>
              Дата выезда
            </label>
            <input
              type="date"
              id="checkOutDate"
              name="checkOutDate"
              value={formData.checkOutDate || ''}
              onChange={handleChange}
              className={styles.formInput}
            />
          </div>
        </div>

        {/* Места для посещения */}
        <div className={styles.formGroup}>
          <label htmlFor="visitDates" className={styles.formLabel}>
            Места посещения
          </label>
          <textarea
            id="visitDates"
            name="visitDates"
            value={formData.visitDates}
            onChange={(e) =>
              setFormData({
                ...formData,
                visitDates: e.target.value
              })
            }
            
            className={styles.formInput}
            placeholder="Места посещения с датами посещения"
          />
        </div>

        {/* Выбор видимости маршрута */}
        <div className={styles.formGroup}>
          <label htmlFor="visibility" className={styles.formLabel}>
            Видимость маршрута
          </label>
          <select
            id="visibility"
            name="visibility"
            value={formData.visibility}
            onChange={handleChange}
            className={styles.formInput}
          >
            <option value="private">Приватный</option>
            <option value="friends">Для друзей</option>
            <option value="public">Публичный</option>
          </select>
        </div>

        {/* Кнопка отправки */}
        <div className={styles.formGroup}>
          <button type="submit" className={styles.submitButton}>
            {isEditMode ? 'Сохранить изменения' : 'Создать маршрут'}
          </button>
        </div>
      </form>
    </div>
  );
}
