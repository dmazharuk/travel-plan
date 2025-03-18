import { addCompanionToRoad, getCompanionsForRoad, removeCompanionFromRoad } from "@/app/entities/companion/api"

import { useAppDispatch, useAppSelector } from "@/shared/hooks/reduxHooks"
import {  useState } from "react"



export default function CompanionWidget() {

  const {road,isLoading,error} = useAppSelector((state)=>state.road)
  const dispatch = useAppDispatch()
  const[newCompanionEmail,setNewCompanionEmail] = useState<string | ''>('')
  const[localError,setLocalError] = useState<string | null>(null)
const {user} = useAppSelector((state)=>state.user)
  // useEffect(()=>{
  //   if(road?.id){
  //      dispatch(getCompanionsForRoad({roadId:road.id}))
  //   }
  // },[dispatch,road?.id])


  const handleAddCompanion = async ()=>{
    if(!road?.id || !newCompanionEmail) return
    if(!/\S+@\S+\.\S+/.test(newCompanionEmail)){
      alert("Некорректный формат email");
      return;
    }
    try {
      const result = await dispatch(addCompanionToRoad({roadId:road.id,email:newCompanionEmail}))
      if(addCompanionToRoad.fulfilled.match(result)){
        setNewCompanionEmail('')
        setLocalError(null)
        dispatch(getCompanionsForRoad({roadId:road.id}))

      }else{
        setLocalError(result.payload?.error ?? 'Ошибка при добавлении компаньона')
      }
    } catch (error) {
      setLocalError('Ошибка при добавлении компаньона')
      console.log(error)
    }
  }
  const handleRemoveCompanion = async(userId:number)=>{
    if(!road?.id) return
    try {
      const result = await dispatch(removeCompanionFromRoad({roadId:road.id,userId}))
      if(removeCompanionFromRoad.fulfilled.match(result)){
        dispatch(getCompanionsForRoad({roadId:road.id}))
      }else{
        setLocalError(result.payload?.error ?? 'Ошибка при удалении компаньона')
      }
    } catch (error) {
      setLocalError('Ошибка при удалении компаньона')
      console.log(error)
    }
  }
  //if (!road?.id){alert("Невозможно добавить компаньона, пока нет маршрута")}
  return (
    <div className="companion-widget">
      <h3>Компаньоны в маршруте</h3>
      
      {(error || localError) && (
        <div className="error-message">{error || localError}</div>
      )}

      <div className="add-companion-form">
        <input
          type="email"
          value={newCompanionEmail}
          onChange={(e) => {
            setNewCompanionEmail(e.target.value);
            setLocalError(null);
          }}
          placeholder="Введите email пользователя"
          disabled={isLoading}
        />
        {road?.author?.id === user?.id && (
        <button 
          onClick={handleAddCompanion}
          disabled={isLoading}
        >
          {isLoading ? "Добавление..." : "Добавить"}
          </button>)}
      
        
      </div>

      {isLoading ? (
        <div>Загрузка списка компаньонов...</div>
      ) : (
        <ul className="companion-list">
        
          {road?.companions?.map((companion) => (
            <li key={companion.id} className="companion-item">
              <div className="companion-info">
                <span>{companion.username
                }</span><br/>
                <span>{companion.email}</span>
              </div>
              {road?.companions.some((c) => c.id === user?.id) && (
              <button 
                onClick={() => handleRemoveCompanion(companion.id)}
                disabled={isLoading}
                className="remove-button"
              >
                Удалить
              </button>)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  
}
