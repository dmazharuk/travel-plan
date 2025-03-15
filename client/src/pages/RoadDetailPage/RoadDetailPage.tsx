import { JSX } from 'react';
import styles from './RoadDetailPage.module.css';
import { RoadDetailForm } from '@/features/road/RoadDetailForm/RoadDetailForm';

export function RoadDetailPage(): JSX.Element {
  return (
    <div className={styles.main} >
      <RoadDetailForm/></div>
  )
}