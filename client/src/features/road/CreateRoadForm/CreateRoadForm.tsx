import { useState, useEffect } from 'react';
import { useAppDispatch } from '@/shared/hooks/reduxHooks';
import { useNavigate, useParams } from 'react-router';
import { createRoad, updateRoad, IRoadRowData, getRoadById } from '@/app/entities/road';
import styles from './CreateRoadForm.module.css';
import { axiosInstance } from '@/shared/lib/axiosInstance';
import CompanionWidget from '@/widgets/CompanionWidget/CompanionWidget';
import { showAlert } from '@/features/alert/slice/alertsSlice';



const initialFormData: IRoadRowData = {
  country: '',
  city: '',
  transport: 'машина', 
  transportInfo: null, 
  routeInfo: '',
  visibility: 'private',
  tripStartDate: '',
  tripEndDate: '',
  accommodation: '',
  checkInDate: '',
  checkOutDate: '',
  visitDates: '', // это поле для рекомендаций что взять с собой!
};

export function CreateRoadForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [formData, setFormData] = useState<IRoadRowData>(initialFormData);

  // Загрузка данных для редактирования
  // useEffect(() => {
  //   if (isEditMode) {
  //     const fetchRoadData = async () => {
  //       const response = await dispatch(getRoadById({ id: Number(id) }));
  //       if (response.payload?.data) {
  //         const roadData = response.payload.data;
  //         setFormData({
  //           city: roadData.city,
  //           country: roadData.country,
  //           transport: roadData.transport,
  //           transportInfo: roadData.transportInfo,
  //           routeInfo: roadData.routeInfo,
  //           visibility: roadData.visibility,
  //           tripStartDate: roadData.tripStartDate,
  //           tripEndDate: roadData.tripEndDate,
  //           accommodation: roadData.accommodation,
  //           checkInDate: roadData.checkInDate,
  //           checkOutDate: roadData.checkOutDate,
  //           visitDates: roadData.visitDates, // Места посещения
  //         });
  //       }
  //     };
  //     fetchRoadData();
  //   }
  // }, [id, dispatch]);

  useEffect(() => {
    if (!isEditMode) return;
  
    const fetchRoadData = async () => {
      try {
        const response = await dispatch(getRoadById({ id: Number(id) })).unwrap();
        if (response?.data) {
          setFormData((prev) => ({ ...prev, ...response.data }));
        }
      } catch (error) {
        console.error('Ошибка загрузки маршрута', error);
        dispatch(showAlert({ message: 'Ошибка загрузки маршрута', status: 'mistake' }));
      }
    };
  
    fetchRoadData();
  }, [isEditMode, id, dispatch]);

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
              flightNumber: '',
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
    // console.log('=====>', formData);

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
      dispatch(showAlert({ message: 'Необходимо заполнить обязательные поля', status: 'mistake' }));
    }
  };

  // Обработчик для получения рекомендаций
  const handleGetRecommendation = async () => {
    try {
      const recomendation = await axiosInstance.post(
        'http://localhost:3000/api/gigachat/recommendations',
        { city: formData.city },
      );
      // console.log(recomendation.data, '<========recomendation');

      setFormData((prevState) => ({
        ...prevState,
        routeInfo: recomendation.data.data, 
      }));
      dispatch(showAlert({ message: 'Рекомендации получены', status: 'success' }));
    } catch (error) {
      console.error(`Ошибка при получении рекомендаций ${error}`, error);
      dispatch(showAlert({ message: `Ошибка при получении рекомендаций:${error}`, status: 'mistake' }));

  };
  }

  // Обработчик для получения рекомендаций по вещам
  const handleRecomImportantThings = async () => {
    console.log(formData.city, 'formData.city');
    
    try {
      const recomendation = await axiosInstance.post(
        'http://localhost:3000/api/gigachat/recommendations',
        { city: formData.city,
          type:'items'
         },
      );
      console.log(recomendation.data, '<========recomendation');
      setFormData((prevState) => ({
        ...prevState,
        visitDates: recomendation.data.data,
      }));
    } catch (error) {
      console.error(`Ошибка при получении рекомендаций:${error}`, error);
      dispatch(showAlert({ message: `Ошибка при получении рекомендаций:${error}`, status: 'mistake' }));
    }
  };
  return (
    <div className={styles.formContainer}>
      <h1 className={styles.formTitle}>Создать новый маршрут</h1>
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
              placeholder="обязательно укажите город"
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
              placeholder="обязательно укажите страну"
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
              <label htmlFor="departureTime">Дата отправления (обязательно)</label>
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
              <label htmlFor="arrivalTime">Дата прибытия (обязательно)</label>
              <input
                type="datetime-local"
                id="arrivalTime"
                value={formData.transportInfo?.arrivalTime || ''}
                onChange={(e) => handleTransportInfoChange('arrivalTime', e.target.value)}
                required
              />
            </div>
            {(formData.transport === 'самолет' || formData.transport === 'поезд') && (
              <div className={styles.formGroup}>
                <label htmlFor="flightNumber">Номер рейса (обязательно)</label>
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

        {/* Даты поездки */}

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="tripStartDate" className={styles.formLabel}>
              Дата начала путешествия(обязательное поле)
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
              Дата окончания путешествия(обязательное поле)
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
        {/* Кнопка получения рекомендации */}
        <div className={styles.formGroup}>
          <button
            type="button"
            disabled={!formData.city}
            onClick={handleGetRecommendation}
            className={styles.submitButton}
          >
            спроси меня об интересных метах
          </button>
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
            Что нужно взять с собой
          </label>
          <textarea
            id="visitDates"
            name="visitDates"
            // value={formData.visitDates}
            value={formData.visitDates || ''}
            // onChange={(e) =>
            //   setFormData({
            //     ...formData,
            //     visitDates: e.target.value,
            //   })
            // }
           
            onChange={handleChange}
            className={styles.formInput}
            rows={2}
           
          />
        </div>
       
        {/* Кнопка получения рекомендации */}
        <div className={styles.formGroup}>
          <button
            type="button"
          // disabled={!formData.visitDates}
            onClick={handleRecomImportantThings}
            className={styles.submitButton}
          >
            спроси меня что взять с собой
          </button>
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
        <CompanionWidget />
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
