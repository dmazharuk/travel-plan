import {
  addCompanionToRoad,
  getCompanionsForRoad,
  removeCompanionFromRoad,
} from "@/app/entities/companion/api";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/reduxHooks";
import { useState } from "react";
import { showAlert } from "@/features/alert/slice/alertsSlice";
import styles from "./CompanionWidget.module.css"; // Импортируем стили

export default function CompanionWidget() {
  const { road, isLoading } = useAppSelector((state) => state.road);
  const dispatch = useAppDispatch();
  const [newCompanionEmail, setNewCompanionEmail] = useState<string>("");
  const { user } = useAppSelector((state) => state.user);

  const isOwner = road?.author?.id === user?.id;
  const isCompanion = road?.companions?.some((c) => c.id === user?.id);

  const handleAddCompanion = async () => {
    if (!road?.id || !newCompanionEmail) return;

    if (!/\S+@\S+\.\S+/.test(newCompanionEmail)) {
      dispatch(
        showAlert({ message: "Некорректный формат email", status: "mistake" })
      );
      return;
    }

    try {
      const result = await dispatch(
        addCompanionToRoad({ roadId: road.id, email: newCompanionEmail })
      );

      if (addCompanionToRoad.fulfilled.match(result)) {
        setNewCompanionEmail("");
        dispatch(getCompanionsForRoad({ roadId: road.id }));
        dispatch(
          showAlert({ message: "Попутчик добавлен", status: "success" })
        );
      } else {
        dispatch(
          showAlert({
            message: "Такой пользователь не зарегистрирован",
            status: "mistake",
          })
        );
      }
    } catch (error) {
      dispatch(
        showAlert({
          message: "Ошибка при добавлении попутчика",
          status: "mistake",
        })
      );
      console.error(error);
    }
  };

  const handleRemoveCompanion = async (userId: number) => {
    if (!road?.id) return;

    try {
      const result = await dispatch(
        removeCompanionFromRoad({ roadId: road.id, userId })
      );

      if (removeCompanionFromRoad.fulfilled.match(result)) {
        dispatch(getCompanionsForRoad({ roadId: road.id }));
        dispatch(showAlert({ message: "Попутчик удален", status: "success" }));
      } else {
        dispatch(
          showAlert({
            message: "Ошибка при удалении попутчика",
            status: "mistake",
          })
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      {/* Заголовок с названием города */}
      <h3 className={styles.title}>
        {/* Компаньоны в маршруте в город {road?.city} */}
        Компаньоны 🐒
      </h3>

      {/* Сообщение для хозяина маршрута */}
      {isOwner && (
        <div className={styles.companionItem}>
          <span className={styles.ownerLabel}>
            Вы являетесь организатором маршрута
          </span>
        </div>
      )}

      {/* Сообщение для компаньона маршрута */}
      {isCompanion && !isOwner && (
        <div className={styles.companionItem}>
          <span className={styles.ownerLabel}>
            Вы являетесь компаньоном этого маршрута
          </span>
        </div>
      )}

      {/* Информация о хозяине маршрута (только если пользователь не хозяин) */}
      {!isOwner && road?.author && (
        <div className={styles.companionItemMain}>
         
          <div className={styles.companionInfo}>
            {/* <span>{`Имя: ${road.author.username}`}</span> */}
            <span className={styles.companionMain}>{`${road.author.username}`}</span>
            {/* <br /> */}
            <span>{`почта: ${road.author.email}`}</span>
          </div>
          <span className={styles.ownerLabel}>
            Организатор
          </span>
        </div>
      )}

      {/* Форма добавления компаньона (доступна только хозяину) */}
      {isOwner && (
        <div className={styles.addCompanionForm}>
          <input
            type="email"
            value={newCompanionEmail}
            onChange={(e) => setNewCompanionEmail(e.target.value)}
            placeholder="Введите email пользователя, которого хотите пригласить"
            disabled={isLoading}
          />
          <button onClick={handleAddCompanion} disabled={isLoading}>
            {isLoading ? "Добавление..." : "Добавить"}
          </button>
        </div>
      )}

      {/* Список попутчиков */}
      {isLoading ? (
        <div className={styles.loadingMessage}>
          Загрузка списка компаньонов...
        </div>
      ) : (
        <ul className={styles.companionList}>
          {road?.companions?.map((companion) => (
            <li key={companion.id} className={styles.companionItem}>
              {companion.id === user?.id ? (
                <span className={styles.ownerLabel}>Вы можете:</span>
              ) : (
                <>
                  {/* <span className={styles.ownerLabel}>
                    Компаньон этого маршрута:
                  </span> */}
                  <div className={styles.companionInfo}>
                    {/* <span>{`Имя: ${companion.username}`}</span> */}
                    <span className={styles.visitLabel}>{`${companion.username}`}</span>
                    {/* <br /> */}
                    <span className={styles.emailLabel}>{`почта: ${companion.email}`}</span>
                  </div>
                </>
              )}

              {/* Кнопка удаления */}
              {(isOwner || companion.id === user?.id) && (
                <div>
                  <button
                    onClick={() => handleRemoveCompanion(companion.id)}
                    disabled={isLoading}
                    className={styles.removeButton}
                  >
                    {companion.id === user?.id
                      ? "Удалить себя из маршрута :("
                      // : `Удалить ${companion.username} из компаньонов`}
                      : `Удалить`}
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
