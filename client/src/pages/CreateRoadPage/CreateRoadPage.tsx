import { createRoad, IRoadRowData } from '@/app/entities/road';
import { useAppDispatch } from '@/shared/hooks/reduxHooks';
import { useState } from 'react';
import { useNavigate } from 'react-router';

export function CreateRoadPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const initialFormData: IRoadRowData = {
    city: '',
    country: '',
    transport: 'машина', // по умолчанию
    transportInfo: '',
    routeInfo: '',
    visibility: 'private',
  };

  const [formData, setFormData] = useState<IRoadRowData>(initialFormData);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
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
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          >
            <option value="поезд">Поезд</option>
            <option value="самолет">Самолет</option>
            <option value="машина">Машина</option>
          </select>
        </div>

        <div>
          <label htmlFor="transportInfo" className="block text-sm font-semibold">
            Информация о транспорте
          </label>
          <textarea
            id="transportInfo"
            name="transportInfo"
            value={formData.transportInfo}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            rows={4}
          />
        </div>

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
