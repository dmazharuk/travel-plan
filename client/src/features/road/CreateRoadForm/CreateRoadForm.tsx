import { useState } from "react";
import { useAppDispatch } from "@/shared/hooks/reduxHooks";
import { useNavigate } from "react-router";
import { createRoad, IRoadRowData } from "@/app/entities/road";
import styles from "./CreateRoadForm.module.css";

export function CreateRoadForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const initialFormData: IRoadRowData = {
    city: "",
    country: "",
    transport: "машина",
    transportInfo: "",
    routeInfo: "",
    visibility: "private",
    startDate: "",
    endDate: "",
    hotelName: "",
    checkInDate: "",
    checkOutDate: "",
    placesToVisit: "",
  };

  const [formData, setFormData] = useState<IRoadRowData>(initialFormData);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleTransportChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { value } = event.target;
    setFormData((prevState) => ({ ...prevState, transport: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await dispatch(createRoad(formData)).unwrap();
      navigate("/cabinet");
    } catch (error) {
      console.error("Ошибка при создании маршрута", error);
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
        {(formData.transport === "самолет" ||
          formData.transport === "поезд") && (
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="departureTime" className={styles.formLabel}>
                Время отправления
              </label>
              <input
                type="datetime-local"
                name="departureTime"
                value={formData.departureTime}
                onChange={handleChange}
                className={styles.formInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="arrivalTime" className={styles.formLabel}>
                Время прибытия
              </label>
              <input
                type="datetime-local"
                name="arrivalTime"
                value={formData.arrivalTime}
                onChange={handleChange}
                className={styles.formInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="flightNumber" className={styles.formLabel}>
                Номер рейса
              </label>
              <input
                type="text"
                name="flightNumber"
                value={formData.flightNumber}
                onChange={handleChange}
                className={styles.formInput}
              />
            </div>
          </div>
        )}

        {formData.transport === "машина" && (
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="startDate" className={styles.formLabel}>
                Дата начала
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={styles.formInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="endDate" className={styles.formLabel}>
                Дата окончания
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
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
            value={formData.routeInfo}
            onChange={handleChange}
            className={styles.formInput}
            rows={2}
          />
        </div>

        {/* Информация о жилье */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="hotelName" className={styles.formLabel}>
              Название отеля
            </label>
            <input
              type="text"
              id="hotelName"
              name="hotelName"
              value={formData.hotelName}
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
              value={formData.checkInDate}
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
              value={formData.checkOutDate}
              onChange={handleChange}
              className={styles.formInput}
            />
          </div>
        </div>

        {/* План посещения мест */}
        <div className={styles.formGroup}>
          <label htmlFor="placesToVisit" className={styles.formLabel}>
            План посещения мест
          </label>
          <textarea
            id="placesToVisit"
            name="placesToVisit"
            value={formData.placesToVisit}
            onChange={handleChange}
            className={styles.formInput}
            rows={2}
          />
        </div>

        {/* Выбор приватности */}
        <div className={styles.formGroup}>
          <label htmlFor="visibility" className={styles.formLabel}>
            Доступность маршрута
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
            Создать маршрут
          </button>
        </div>
      </form>
    </div>
  );
}