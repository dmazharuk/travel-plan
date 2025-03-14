import React from "react";
import styles from "./CalendarPage.module.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

type Props = {};

export function CalendarPage({}: Props) {
  return (
    <div className={styles.main}>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={[
          { title: "Событие 1", date: "2023-10-01" },
          { title: "Событие 2", date: "2023-10-02" },
        ]}
      />
    </div>
  );
}
