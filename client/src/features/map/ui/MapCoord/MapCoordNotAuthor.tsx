import { useState } from "react";
import styles from "./MapCoord.module.css"; // Подключаем стили

export function MapCoordNotAuthor({ coord }) {
  const [inputs, setInputs] = useState({
    coordinateTitle: coord.coordinateTitle,
    coordinateBody: coord.coordinateBody,
  });
  const [editable] = useState(false);
  // const [editable, setEditable] = useState(false);

  function changeInputsHandler({ target }) {
    const { value, name } = target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  }

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
    </div>
  );
}
