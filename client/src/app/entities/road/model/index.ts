// Интерфейс для данных при создании маршрута
export interface IRoadRowData {
  country: string;
  city: string;
  transport: string;
  transportInfo: string;
  routeInfo: string;
  visibility: string;
  
  // Добавляем поля для транспорта
  departureTime?: string; // для транспорта (самолет, поезд)
  arrivalTime?: string;   // для транспорта (самолет, поезд)
  flightNumber?: string;  // для рейсов
  
  // Для машин
  startDate?: string;   // Начало поездки для машины
  endDate?: string;     // Конец поездки для машины
  
  // Информация о жилье
  hotelName?: string;
  checkInDate?: string;
  checkOutDate?: string;
  
  // План посещения мест
  placesToVisit?: string;
}

// Интерфейс для маршрута с учетом ассоциаций и связей с пользователями
export interface IRoad extends IRoadRowData {
  id: number;
  createdAt: Date;
  updatedAt: Date;

  // Информация о пользователе, который создал маршрут (author)
  author: {
    id: number;
    username: string;
    email: string;
  };

  // Список спутников, теперь ассоциация через companions
  companions: Array<{
    id: number;
    username: string;
    email: string;
  }>;
}

// Массив маршрутов
export type RouteArrayType = IRoad[];

