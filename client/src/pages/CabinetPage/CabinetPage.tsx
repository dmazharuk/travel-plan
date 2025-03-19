// import { FriendsRoutes } from "@/widgets/FriendsRoutes/FriendsRoutes";
import { MyRoads } from "@/widgets/MyRoads/MyRoads";
import styles from "./CabinetPage.module.css";


export default function CabinetPage() {
  return (
    <div className={styles.main}>
      <MyRoads />
    </div>
  )
}
