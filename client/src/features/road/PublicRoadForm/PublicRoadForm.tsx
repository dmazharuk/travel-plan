import { useAppDispatch } from '@/shared/hooks/reduxHooks';
import { getAllRoads } from "@/app/entities/road/api";
import { useEffect } from "react";
import{useAppSelector} from "@/shared/hooks/reduxHooks"
import styles from "../../../widgets/MyRoads/MyRoads.module.css"
import { useNavigate } from 'react-router';
export default function PublicRoadForm() {

  const dispatch = useAppDispatch()
  const allPublicRoads = useAppSelector(state=>state.road.roads.filter(road=>road.visibility === 'public'))
  const user = useAppSelector(state=>state.user.user)
  
const navigate = useNavigate()

  useEffect(()=>{
    dispatch(getAllRoads())
  },[dispatch])
  
  
  return (
    <div>
      {<div className={styles.roadList}>
          {allPublicRoads.map((road) => (
            <div
              key={road.id}
              className={styles.roadItem}
             
             
              
              
            >
              <div className={styles.roadHeader}>
                <div>
                  <h3 className={styles.roadTitle}>
                    {road.city}, {road.country}
                  </h3>
                  <p className={styles.roadDate}>
                    Создан: {new Date(road.createdAt).toLocaleDateString()}
                    <br />
                    Создатель: {road.author?.username}
                  </p>
                  <p className={styles.tripDate}>
                    Даты путешествия:{' '}
                    {`${new Date(road.tripStartDate).toLocaleDateString()} - ${new Date(road.tripEndDate).toLocaleDateString()}`}
                  </p>

                  {user ?(<button onClick={()=>navigate (`/cabinet/road/${road.id}`)}>посмотреть подробности</button>):(<button onClick={()=>navigate(`/login`)}>посмотреть подробности</button>)}
                 
                </div>
                
              </div>
            </div>
          ))}
        </div>}
      </div>
  )
}
