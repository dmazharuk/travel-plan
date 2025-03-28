import { ChangeEvent, useState } from "react";
import styles from "./MapCoord.module.css"; 

interface Coordinate {
  id: number;
  coordinateTitle: string;
  coordinateBody: string;
}

//

export function MapCoordNotAuthor({ coord }: { coord: Coordinate }) {
  const [inputs, setInputs] = useState({
    coordinateTitle: coord.coordinateTitle,
    coordinateBody: coord.coordinateBody,
  });
  const [editable] = useState(false);
  // const [editable, setEditable] = useState(false);

  function changeInputsHandler({ target }: ChangeEvent<HTMLInputElement>) {
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
