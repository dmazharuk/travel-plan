import { deleteCoordinateThunk, updateCoordinateThunk } from "@/app/entities/coordinate";
import { useAppDispatch } from "@/shared/hooks/reduxHooks";
import { ChangeEvent, useState } from "react";
import styles from "./MapCoord.module.css"; // Подключаем стили

interface Coordinate {
  id: number;
  coordinateTitle: string;
  coordinateBody: string;
}

export function MapCoord({ coord }: { coord: Coordinate }) {
  const [inputs, setInputs] = useState({
    coordinateTitle: coord.coordinateTitle,
    coordinateBody: coord.coordinateBody,
  });
  const [editable, setEditable] = useState(false);
  const dispatch = useAppDispatch();

  function changeInputsHandler({ target }: ChangeEvent<HTMLInputElement>) {
    const { value, name } = target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  }

  const handleSave = (coordinateId: number) => {
    const updatedCoordinate = {
      coordinateTitle: inputs.coordinateTitle,
      coordinateBody: inputs.coordinateBody,
    };

    if (coordinateId) {
      dispatch(
        updateCoordinateThunk({
          id: Number(coordinateId),
          updatedCoordinate: updatedCoordinate,
        })
      );
      setEditable(false);
    }
  };

  const deleteCoordinate = (coordinateId: number) => {
    dispatch(deleteCoordinateThunk(coordinateId))
      .unwrap()
      .then(() => {})
      .catch((error) => {
        console.error("Ошибка при удалении координаты:", error);
      });
  };

  return (
    <div className={styles.coordinateContainer}>


      
      {editable ? (
        <div>
          <input
            name="coordinateTitle"
            value={inputs.coordinateTitle || ""}
            onChange={changeInputsHandler}
            className={styles.coordinateInput}
          />
          <input
            name="coordinateBody"
            value={inputs.coordinateBody || ""}
            onChange={changeInputsHandler}
            className={styles.coordinateInput}
          />
        </div>
      ) : (
        <div>
          {coord.coordinateTitle}, {coord.coordinateBody}
        </div>
      )}

      <div>
        {/* Кнопка редактирования */}
        <button
          type="button"
          className={`${styles.coordinateButton} ${styles.editButton}`}
          onClick={() => setEditable(!editable)}
        >
          {editable ? 
          <div className={styles.coordinateButtonNo}> Отменить</div>
         
          : <img src="/iconnotes.png" className={styles.coordinateIcon} />}
        </button>

        {/* Кнопка сохранения (если редактирование активно) */}
        {editable && (
          <button
            type="button"
            className={`${styles.coordinateButton} ${styles.buttonSuccess}`}
            onClick={() => handleSave(coord.id)}
          >
            <div className={styles.coordinateButtonEdit}>Сохранить</div>
            
          </button>
        )}

        {/* Кнопка корзины */}
        {!editable && (
          <button
            type="button"
            className={`${styles.coordinateButton} ${styles.deleteButton}`}
            onClick={() => deleteCoordinate(coord.id)}
          >
            <img src="/rubishbin.png" className={styles.coordinateIcon} />
          </button>
        )}
      </div>
    </div>
  );
}