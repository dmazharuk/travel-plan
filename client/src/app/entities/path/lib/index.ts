// import { createPathThunk } from '../api';
// import { useAppDispatch } from '@/shared/hooks/reduxHooks';

// export const useCreateNewPath = () => {
//   const dispatch = useAppDispatch();

//   const createNewPath = async (): Promise<boolean> => {
//     const resultAction = await dispatch(createPathThunk({ pathName: 'новая карта', roadId: 1 }));
//     console.log('Результат создания:', resultAction);
//     return resultAction.meta.requestStatus === 'fulfilled';
//   };

//   return { createNewPath };
// };

import { createPathThunk } from '../api';
import { useAppDispatch } from '@/shared/hooks/reduxHooks';


export const useCreateNewPath = () => {
  const dispatch = useAppDispatch();

  const createNewPath = async (): Promise<{ id: number } | null> => {
    const resultAction = await dispatch(createPathThunk({ pathName: 'новая карта', roadId: 1 }));
    if (resultAction.meta.requestStatus === 'fulfilled') {
      return { id: resultAction.payload!.data!.id }; // Возвращаем id созданного path
    }
    return null;
  };

  return { createNewPath };
};