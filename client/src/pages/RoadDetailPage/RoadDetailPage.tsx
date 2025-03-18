
import { JSX } from 'react';
import styles from './RoadDetailPage.module.css';
import { RoadDetailForm } from '@/features/road/RoadDetailForm/RoadDetailForm';
import CompanionWidget from '@/widgets/CompanionWidget/CompanionWidget';


export function RoadDetailPage(): JSX.Element {
  return (
    <div className={styles.main} >
      <RoadDetailForm/>
      <CompanionWidget/>
      </div>
  )
}