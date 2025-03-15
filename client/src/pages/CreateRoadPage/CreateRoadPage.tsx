import { JSX } from 'react';
import { CreateRoadForm } from "@/features/road/CreateRoadForm/CreateRoadForm";
import styles from './CreateRoadPage.module.css';

export function CreateRoadPage(): JSX.Element {
  return (
    <div className={styles.main} >
      <CreateRoadForm/></div>
  )
}