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

export function RoadDetailForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const road = useAppSelector((state) =>
    state.road.roads.find((road) => road.id === Number(id))
  );

  const [editable, setEditable] = useState(false);
  const [formData, setFormData] = useState<Partial<IRoad>>({
    city: road?.city,
    country: road?.country,
    transport: road?.transport,
    transportInfo: road?.transportInfo,
    routeInfo: road?.routeInfo,
    visibility: road?.visibility,
    startDate: road?.startDate,
    endDate: road?.endDate,
    hotelName: road?.hotelName,
    checkInDate: road?.checkInDate,
    checkOutDate: road?.checkOutDate,
    placesToVisit: road?.placesToVisit,
  });

  useEffect(() => {
    if (id) {
      dispatch(getRoadById({ id: Number(id) }));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (road) {
      setFormData({
        city: road.city,
        country: road.country,
        transport: road.transport,
        transportInfo: road.transportInfo,
        routeInfo: road.routeInfo,
        visibility: road.visibility,
        startDate: road.startDate,
        endDate: road.endDate,
        hotelName: road.hotelName,
        checkInDate: road.checkInDate,
        checkOutDate: road.checkOutDate,
        placesToVisit: road.placesToVisit,
      });
    }
  }, [road]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (id) {
      dispatch(updateRoad({ id: Number(id), roadData: formData }));
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
        {/* Страна и город в одной строке */}
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

        {/* Транспорт и информация о транспорте */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Транспорт</label>
            <input
              type="text"
              name="transport"
              className={styles.formInput}
              value={formData.transport || ""}
              onChange={handleChange}
              disabled={!editable}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Информация о транспорте</label>
            <input
              type="text"
              name="transportInfo"
              className={styles.formInput}
              value={formData.transportInfo || ""}
              onChange={handleChange}
              disabled={!editable}
            />
          </div>
        </div>

        {/* Информация о маршруте */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Информация о маршруте</label>
          <textarea
            name="routeInfo"
            className={styles.formTextarea}
            value={formData.routeInfo || ""}
            onChange={handleChange}
            disabled={!editable}
            rows={2}
          />
        </div>

        {/* Приватность */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Приватность</label>
          <select
            name="visibility"
            className={styles.formSelect}
            value={formData.visibility || ""}
            onChange={handleChange}
            disabled={!editable}
          >
            <option value="private">Приватный</option>
            <option value="friends">Для друзей</option>
            <option value="public">Публичный</option>
          </select>
        </div>

        {/* Даты поездки */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Дата начала</label>
            <input
              type="date"
              name="startDate"
              className={styles.formInput}
              value={formData.startDate || ""}
              onChange={handleChange}
              disabled={!editable}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Дата окончания</label>
            <input
              type="date"
              name="endDate"
              className={styles.formInput}
              value={formData.endDate || ""}
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
              name="hotelName"
              className={styles.formInput}
              value={formData.hotelName || ""}
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

        {/* План посещения мест */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>План посещения мест</label>
          <textarea
            name="placesToVisit"
            className={styles.formTextarea}
            value={formData.placesToVisit || ""}
            onChange={handleChange}
            disabled={!editable}
            rows={2}
          />
        </div>
      </div>

      {/* Кнопки */}
      <div className={styles.buttonGroup}>
        <button
          className={`${styles.button} ${styles.buttonPrimary}`}
          onClick={() => setEditable(!editable)}
        >
          {editable ? "Отменить" : "Изменить маршрут"}
        </button>
        {editable && (
          <button
            className={`${styles.button} ${styles.buttonSuccess}`}
            onClick={handleSave}
          >
            Сохранить
          </button>
        )}
        <button
          className={`${styles.button} ${styles.buttonDanger}`}
          onClick={handleDelete}
        >
          Удалить маршрут
        </button>
      </div>
    </div>
  );
}
