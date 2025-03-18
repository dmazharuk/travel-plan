import { addCompanionToRoad, getCompanionsForRoad, removeCompanionFromRoad } from "@/app/entities/companion/api";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/reduxHooks";
import { useState } from "react";
import { showAlert } from "@/features/alert/slice/alertsSlice";

export default function CompanionWidget() {
  const { road, isLoading, error } = useAppSelector((state) => state.road);
  const dispatch = useAppDispatch();
  const [newCompanionEmail, setNewCompanionEmail] = useState<string>("");
  const [localError, setLocalError] = useState<string | null>(null);
  const { user } = useAppSelector((state) => state.user);

  // Проверка, является ли текущий пользователь хозяином маршрута
  const isOwner = road?.author?.id === user?.id;

  // Проверка, является ли текущий пользователь попутчиком
  // const isCompanion = road?.companions?.some((c) => c.id === user?.id);

  // Обработчик добавления попутчика
  const handleAddCompanion = async () => {
    if (!road?.id || !newCompanionEmail) return;

    // Валидация email
    if (!/\S+@\S+\.\S+/.test(newCompanionEmail)) {
      dispatch(showAlert({ message: "Некорректный формат email", status: "mistake" }));
      return;
    }

    try {
      const result = await dispatch(
        addCompanionToRoad({ roadId: road.id, email: newCompanionEmail })
      );

      if (addCompanionToRoad.fulfilled.match(result)) {
        setNewCompanionEmail("");
        setLocalError(null);
        dispatch(getCompanionsForRoad({ roadId: road.id })); // Обновляем список попутчиков
        dispatch(showAlert({ message: "Попутчик добавлен", status: "success" }));
      } else {
        setLocalError(result.payload?.error ?? "Ошибка при добавлении попутчика");
        dispatch(showAlert({ message: "Ошибка при добавлении попутчика", status: "mistake" }));
      }
    } catch (error) {
      setLocalError("Ошибка при добавлении попутчика");
      console.error(error);
    }
  };

  // Обработчик удаления попутчика
  const handleRemoveCompanion = async (userId: number) => {
    if (!road?.id) return;

    try {
      const result = await dispatch(
        removeCompanionFromRoad({ roadId: road.id, userId })
      );

      if (removeCompanionFromRoad.fulfilled.match(result)) {
        dispatch(getCompanionsForRoad({ roadId: road.id })); // Обновляем список попутчиков
        dispatch(showAlert({ message: "Попутчик удален", status: "success" }));
      } else {
        setLocalError(result.payload?.error ?? "Ошибка при удалении попутчика");
        dispatch(showAlert({ message: "Ошибка при удалении попутчика", status: "mistake" }));
      }
    } catch (error) {
      setLocalError("Ошибка при удалении попутчика");
      console.error(error);
    }
  };

  return (
    <div className="companion-widget">
      <h3>Компаньоны в маршруте</h3>

      {/* Отображение ошибок */}
      {(error || localError) && (
        <div className="error-message">{error || localError}</div>
      )}

      {/* Форма добавления попутчика (только для хозяина) */}
      {isOwner && (
        <div className="add-companion-form">
          <input
            type="email"
            value={newCompanionEmail}
            onChange={(e) => {
              setNewCompanionEmail(e.target.value);
              setLocalError(null);
            }}
            placeholder="Введите email пользователя"
            disabled={isLoading}
          />
          <button onClick={handleAddCompanion} disabled={isLoading}>
            {isLoading ? "Добавление..." : "Добавить"}
          </button>
        </div>
      )}

      {/* Список попутчиков */}
      {isLoading ? (
        <div>Загрузка списка компаньонов...</div>
      ) : (
        <ul className="companion-list">
          {/* Отображение хозяина маршрута */}
          {road?.author && (
            <li key={road.author.id} className="companion-item">
              <div className="companion-info">
                <span>{road.author.username}</span>
                <br />
                <span>{road.author.email}</span>
              </div>
              <span className="owner-label">Хозяин маршрута</span>
            </li>
          )}

          {/* Отображение попутчиков */}
          {road?.companions?.map((companion) => (
            <li key={companion.id} className="companion-item">
              <div className="companion-info">
                <span>{companion.username}</span>
                <br />
                <span>{companion.email}</span>
              </div>

              {/* Кнопка удаления (для хозяина или для себя) */}
              {(isOwner || companion.id === user?.id) && (
                <button
                  onClick={() => handleRemoveCompanion(companion.id)}
                  disabled={isLoading}
                  className="remove-button"
                >
                  Удалить
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}