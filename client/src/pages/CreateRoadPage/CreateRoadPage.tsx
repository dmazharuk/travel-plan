import { useState } from 'react';
import { useAppDispatch } from '@/shared/hooks/reduxHooks';
import { useNavigate } from 'react-router';
import { createRoad, IRoadRowData } from '@/app/entities/road';

export function CreateRoadPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const initialFormData: IRoadRowData = {
    city: '',
    country: '',
    transport: 'машина',
    transportInfo: '',
    routeInfo: '',
    visibility: 'private',
    startDate: '',
    endDate: '',
    hotelName: '',
    checkInDate: '',
    checkOutDate: '',
    placesToVisit: '',
  };

  const [formData, setFormData] = useState<IRoadRowData>(initialFormData);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleTransportChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setFormData((prevState) => ({ ...prevState, transport: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await dispatch(createRoad(formData)).unwrap();
      navigate('/cabinet');
    } catch (error) {
      console.error('Ошибка при создании маршрута', error);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Создать новый маршрут</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="city" className="block text-sm font-semibold">
            Город
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="country" className="block text-sm font-semibold">
            Страна
          </label>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="transport" className="block text-sm font-semibold">
            Транспорт
          </label>
          <select
            id="transport"
            name="transport"
            value={formData.transport}
            onChange={handleTransportChange}
            className="w-full px-4 py-2 border rounded"
            required
          >
            <option value="поезд">Поезд</option>
            <option value="самолет">Самолет</option>
            <option value="машина">Машина</option>
          </select>
        </div>

        {/* Дополнительные поля для транспорта */}
        {(formData.transport === 'самолет' || formData.transport === 'поезд') && (
          <div>
            <label htmlFor="departureTime" className="block text-sm font-semibold">
              Время отправления
            </label>
            <input
              type="datetime-local"
              name="departureTime"
              value={formData.departureTime}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
            />
            <label htmlFor="arrivalTime" className="block text-sm font-semibold">
              Время прибытия
            </label>
            <input
              type="datetime-local"
              name="arrivalTime"
              value={formData.arrivalTime}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
            />
            <label htmlFor="flightNumber" className="block text-sm font-semibold">
              Номер рейса
            </label>
            <input
              type="text"
              name="flightNumber"
              value={formData.flightNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
            />
          </div>
        )}

        {formData.transport === 'машина' && (
          <div>
            <label htmlFor="startDate" className="block text-sm font-semibold">
              Дата начала поездки
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
            />
            <label htmlFor="endDate" className="block text-sm font-semibold">
              Дата окончания поездки
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
            />
          </div>
        )}

        {/* Информация о маршруте */}
        <div>
          <label htmlFor="routeInfo" className="block text-sm font-semibold">
            Информация о маршруте
          </label>
          <textarea
            id="routeInfo"
            name="routeInfo"
            value={formData.routeInfo}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            rows={4}
          />
        </div>

        {/* Информация о жилье */}
        <div>
          <label htmlFor="hotelName" className="block text-sm font-semibold">
            Название отеля
          </label>
          <input
            type="text"
            id="hotelName"
            name="hotelName"
            value={formData.hotelName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="checkInDate" className="block text-sm font-semibold">
            Дата заезда
          </label>
          <input
            type="date"
            id="checkInDate"
            name="checkInDate"
            value={formData.checkInDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="checkOutDate" className="block text-sm font-semibold">
            Дата выезда
          </label>
          <input
            type="date"
            id="checkOutDate"
            name="checkOutDate"
            value={formData.checkOutDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="placesToVisit" className="block text-sm font-semibold">
            План посещения мест
          </label>
          <textarea
            id="placesToVisit"
            name="placesToVisit"
            value={formData.placesToVisit}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            rows={4}
          />
        </div>

        {/* Выбор приватности */}
        <div>
          <label htmlFor="visibility" className="block text-sm font-semibold">
            Доступность маршрута
          </label>
          <select
            id="visibility"
            name="visibility"
            value={formData.visibility}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          >
            <option value="private">Приватный</option>
            <option value="friends">Для друзей</option>
            <option value="public">Публичный</option>
          </select>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Создать маршрут
          </button>
        </div>
      </form>
    </div>
  );
}
