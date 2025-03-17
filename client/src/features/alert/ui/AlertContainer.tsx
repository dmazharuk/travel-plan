import { useAppSelector } from '@/shared/hooks/reduxHooks';
import styles from './Alert.module.css';
import { Alert } from './Alert';

export function AlertContainer() {
  const alerts = useAppSelector((state) => state.alerts.alerts);

  return (
    <div className={styles.alertContainer}>
      {alerts.map((alert) => (
        <Alert key={alert.id} alert={alert} />
      ))}
    </div>
  );
}
