import { useState, useEffect } from 'react';
import { useAppDispatch } from '@/shared/hooks/reduxHooks';
import { useLocation, useNavigate, useParams } from 'react-router';
import {
  createRoad,
  updateRoad,
  IRoadRowData,
  getRoadById,
} from '@/app/entities/road';
import styles from './CreateRoadForm.module.css';
import { axiosInstance } from '@/shared/lib/axiosInstance';

import { showAlert } from '@/features/alert/slice/alertsSlice';
import { updatePathThunk, useCreateNewPath } from '@/app/entities/path';
import RouteManager from '@/features/map/ui/RouteManager/RouteManager';
import {
  GeoapifyGeocoderAutocomplete,
  GeoapifyContext,
} from '@geoapify/react-geocoder-autocomplete';
import '@geoapify/geocoder-autocomplete/styles/minimal.css';
import './CreateRoadForm.css';

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
  const [aiThink, setAiThink] = useState(false);

  //история с датами из welcomePage
  const location = useLocation();
  const { startDate, endDate } = location.state || {
    startDate: null,
    endDate: null,
  };

  useEffect(() => {
    if (startDate && endDate) {
      const newStartDate = new Date(startDate);
      newStartDate.setDate(newStartDate.getDate() + 1);
      const startDateString = newStartDate.toISOString().split('T')[0];
      const newEndDate = new Date(endDate);
      newEndDate.setDate(newEndDate.getDate() + 1);
      const endDateString = newEndDate.toISOString().split('T')[0];

      setFormData((prev) => ({
        ...prev,
        tripStartDate: startDateString,
        tripEndDate: endDateString,
      }));
    }

    if (!isEditMode) return;

    const fetchRoadData = async () => {
      try {
        const response = await dispatch(
          getRoadById({ id: Number(id) })
        ).unwrap();
        if (response?.data) {
          setFormData((prev) => ({ ...prev, ...response.data }));
        }
        // dispatch(resetRoad());
      } catch (error) {
        console.error('Ошибка загрузки маршрута', error);
        dispatch(
          showAlert({ message: 'Ошибка загрузки маршрута', status: 'mistake' })
        );
      }
    };

    fetchRoadData();
  }, [isEditMode, id, dispatch, startDate, endDate]);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  // Обработчик изменений для выбора транспорта
  const handleTransportChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
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

  //

  // логика карты тут
  const [isMapVisible, setIsMapVisible] = useState(false); // Создаем состояние для видимости карты
  const { createNewPath } = useCreateNewPath();
  const [pathId, setPathId] = useState<number | null>(null); // Состояние для хранения pathId
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_roadIdState, setRadIdState] = useState<number | null>(null); // Состояние для хранения roadId

  const handleToggleMap = async () => {
    if (isMapVisible === true) {
      setIsMapVisible((prev) => !prev); // Меняем состояние по клику на кнопку
    } else {
      const isPathCreated = await createNewPath(); //создание path
      // console.log(isPathCreated?.id);

      if (isPathCreated!) {
        setIsMapVisible((prev) => !prev); // Меняем состояние по клику на кнопку
        setPathId(isPathCreated?.id); // Сохраняем pathId
      } else {
        console.error('Ошибка при добавлении карты');
      }
    }
  };

  // Обработчик отправки формы
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // console.log('=====>', formData);

    try {
      if (isEditMode) {
        // Обновление маршрута
        await dispatch(
          updateRoad({ id: Number(id), roadData: formData })
        ).unwrap();
      } else {
        // Создание нового маршрута
        const createdRoad = await dispatch(createRoad(formData)).unwrap();

        //получение roadId и обновление path
        const roadId = createdRoad.data.id; // Получаем roadId
        setRadIdState(roadId); // Сохраняем roadId в состоянии
        // console.log(roadIdState);

        if (pathId) {
          try {
            await dispatch(
              updatePathThunk({
                id: pathId, // ID пути
                updatedPath: { roadId }, // Обновляем только roadId
              })
            ).unwrap();
            // console.log("Path updated with roadId:", roadId);
          } catch (error) {
            console.error('Ошибка при обновлении path:', error);
          }
        } else {
          console.error('pathId не определен');
        }
      }
      navigate('/cabinet');
    } catch (error) {
      console.error('Ошибка при сохранении маршрута', error);
      dispatch(
        showAlert({
          message: 'Необходимо заполнить обязательные поля',
          status: 'mistake',
        })
      );
    }
  };

  // Обработчик для получения рекомендаций
  const handleGetRecommendation = async () => {
    try {
      setAiThink(true);
      const recomendation = await axiosInstance.post(
        '/gigachat/recommendations',
        { city: formData.city }
      );

      setFormData((prevState) => ({
        ...prevState,
        routeInfo: recomendation.data.data,
      }));
      dispatch(
        showAlert({ message: 'Рекомендации получены', status: 'success' })
      );
    } catch (error) {
      console.error(`Ошибка при получении рекомендаций ${error}`, error);
      dispatch(
        showAlert({
          message: `Ошибка при получении рекомендаций:${error}`,
          status: 'mistake',
        })
      );
    } finally {
      setAiThink(false);
    }
  };

  // Обработчик для получения рекомендаций по вещам
  const handleRecomImportantThings = async () => {
    try {
      setAiThink(true);
      const recomendation = await axiosInstance.post(
        '/gigachat/recommendations',
        { city: formData.city, type: 'items' }
      );
      console.log(recomendation.data, '<========recomendation');
      setFormData((prevState) => ({
        ...prevState,
        visitDates: recomendation.data.data,
      }));
    } catch (error) {
      console.error(`Ошибка при получении рекомендаций:${error}`, error);
      dispatch(
        showAlert({
          message: `Ошибка при получении рекомендаций:${error}`,
          status: 'mistake',
        })
      );
    } finally {
      setAiThink(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCitySelect = (value: any) => {
    if (value) {
      const city = value.properties.city || value.properties.name;
      const country = value.properties.country;

      setFormData((prev) => ({
        ...prev,
        city: city,
        country: country,
      }));
    }
  };

  return (
    <div className={styles.formContainer}>
      <h1 className={styles.formTitle}>Создание нового маршрута</h1>
      <form onSubmit={handleSubmit} className={styles.formGrid}>
        {/* Город и страна в одной строке */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Город <span className={styles.required}>*</span>
            </label>
            <GeoapifyContext apiKey={import.meta.env.VITE_GEOAPIFY_KEY}>
              <GeoapifyGeocoderAutocomplete
                placeholder="Куда едем?"
                type="city"
                lang="ru"
                value={formData.city}
                placeSelect={handleCitySelect}
              />
            </GeoapifyContext>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="country" className={styles.formLabel}>
              Страна <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              readOnly
              className={styles.formInput}
              required
              placeholder="Автоматически заполнится при выборе города"
            />
          </div>
        </div>

        {/* Транспорт */}
        <div className={styles.formGroup}>
          <label htmlFor="transport" className={styles.formLabel}>
            Тип транспорта <span className={styles.required}>*</span>
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

        {(formData.transport === 'самолет' ||
          formData.transport === 'поезд') && (
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="departureTime" className={styles.formLabel}>
                Дата отправления <span className={styles.required}>*</span>
              </label>
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
              <label htmlFor="arrivalTime" className={styles.formLabel}>
                Дата прибытия <span className={styles.required}>*</span>
              </label>
              <input
                type="datetime-local"
                id="arrivalTime"
                value={formData.transportInfo?.arrivalTime || ''}
                onChange={(e) =>
                  handleTransportInfoChange('arrivalTime', e.target.value)
                }
                required
              />
            </div>
            {(formData.transport === 'самолет' ||
              formData.transport === 'поезд') && (
              <div className={styles.formGroup}>
                <label htmlFor="flightNumber" className={styles.formLabel}>
                  Номер рейса <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  id="flightNumber"
                  value={formData.transportInfo?.flightNumber || ''}
                  onChange={(e) =>
                    handleTransportInfoChange('flightNumber', e.target.value)
                  }
                  className={styles.formInput}
                  placeholder="Например: SU 1442"
                  required
                  style={{ textTransform: 'uppercase' }}
                />
              </div>
            )}
          </div>
        )}

        {/* Даты поездки */}

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="tripStartDate" className={styles.formLabel}>
              Дата начала путешествия <span className={styles.required}>*</span>
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
              Дата окончания путешествия{' '}
              <span className={styles.required}>*</span>
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
            disabled={!formData.city || aiThink}
            onClick={handleGetRecommendation}
            className={styles.aiButton}
            title={!formData.city ? 'Сначала введите город' : ''}
          >
            <span
              className={
                !formData.city ? styles.aiBadge : styles.aiBadgeNoBlock
              }
            >
              AI
            </span>
            {!formData.city
              ? 'Сначала введите город'
              : 'Спросить об интересных местах'}
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
            value={formData.visitDates || ''}
            onChange={handleChange}
            className={styles.formInput}
            rows={2}
          />
        </div>

        {/* Кнопка получения рекомендации */}
        <div className={styles.formGroup}>
          <button
            type="button"
            disabled={!formData.city || aiThink}
            onClick={handleRecomImportantThings}
            className={styles.aiButton}
            title={!formData.city ? 'Сначала введите город' : ''}
          >
            <span
              className={
                !formData.city ? styles.aiBadge : styles.aiBadgeNoBlock
              }
            >
              AI
            </span>
            {!formData.city ? 'Сначала введите город' : 'Что взять с собой?'}
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
        {/* КАРТА */}
        <div className={styles.main}>
          <h3 className={styles.title}>Карта путешествия 📌</h3>
          <button
            type="button"
            onClick={handleToggleMap}
            className={styles.mapButton}
          >
            {isMapVisible ? 'Скрыть карту' : 'Добавим карту?'}
          </button>
          {isMapVisible && <RouteManager pathId={pathId} />}{' '}
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
