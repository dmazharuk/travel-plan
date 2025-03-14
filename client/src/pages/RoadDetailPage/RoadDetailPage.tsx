import { deleteRoad, getRoadById, IRoad, updateRoad } from "@/app/entities/road";
import { CLIENT_ROUTES } from "@/shared/enums/clientRoutes";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/reduxHooks";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

export function RoadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const road = useAppSelector((state) => state.road.roads.find((road) => road.id === Number(id)));

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
    <div className="container mt-4">
      <h2>Детали маршрута</h2>
      <div className="mb-3">
        <label className="form-label">Страна</label>
        <input
          type="text"
          name="country"
          className="form-control"
          value={formData.country || ''}
          onChange={handleChange}
          disabled={!editable}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Город</label>
        <input
          type="text"
          name="city"
          className="form-control"
          value={formData.city || ''}
          onChange={handleChange}
          disabled={!editable}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Транспорт</label>
        <input
          type="text"
          name="transport"
          className="form-control"
          value={formData.transport || ''}
          onChange={handleChange}
          disabled={!editable}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Информация о транспорте</label>
        <input
          type="text"
          name="transportInfo"
          className="form-control"
          value={formData.transportInfo || ''}
          onChange={handleChange}
          disabled={!editable}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Информация о маршруте</label>
        <input
          type="text"
          name="routeInfo"
          className="form-control"
          value={formData.routeInfo || ''}
          onChange={handleChange}
          disabled={!editable}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Приватность</label>
        <select
          name="visibility"
          className="form-control"
          value={formData.visibility || ''}
          onChange={handleChange}
          disabled={!editable}
        >
          <option value="private">Приватный</option>
          <option value="friends">Для друзей</option>
          <option value="public">Публичный</option>
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label">Дата начала поездки</label>
        <input
          type="date"
          name="startDate"
          className="form-control"
          value={formData.startDate || ''}
          onChange={handleChange}
          disabled={!editable}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Дата окончания поездки</label>
        <input
          type="date"
          name="endDate"
          className="form-control"
          value={formData.endDate || ''}
          onChange={handleChange}
          disabled={!editable}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Название отеля</label>
        <input
          type="text"
          name="hotelName"
          className="form-control"
          value={formData.hotelName || ''}
          onChange={handleChange}
          disabled={!editable}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Дата заезда</label>
        <input
          type="date"
          name="checkInDate"
          className="form-control"
          value={formData.checkInDate || ''}
          onChange={handleChange}
          disabled={!editable}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Дата выезда</label>
        <input
          type="date"
          name="checkOutDate"
          className="form-control"
          value={formData.checkOutDate || ''}
          onChange={handleChange}
          disabled={!editable}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">План посещения мест</label>
        <textarea
          name="placesToVisit"
          className="form-control"
          value={formData.placesToVisit || ''}
          onChange={handleChange}
          disabled={!editable}
        />
      </div>

      <button className="btn btn-primary me-2" onClick={() => setEditable(!editable)}>
        {editable ? 'Отменить' : 'Изменить маршрут'}
      </button>
      {editable && (
        <button className="btn btn-success me-2" onClick={handleSave}>
          Сохранить
        </button>
      )}
      <button className="btn btn-danger" onClick={handleDelete}>
        Удалить маршрут
      </button>
    </div>
  );
}
