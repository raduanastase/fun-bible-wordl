import { Button, View } from 'react-native';
import { useDispatch } from 'react-redux';

import {
  setGameLanguage,
  setGameStarted,
} from '../../store/slices/gameStateSlice';
import { setStoreData } from '../../utils/localStorageFuncs';

export default function Settings() {
  const dispatch = useDispatch();

  const resetGame = () => {
    dispatch(setGameStarted(false));
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        title="EN"
        onPress={() => {
          dispatch(setGameLanguage('en'));
          setStoreData('language', 'en');
          resetGame();
        }}
      />
      <Button
        title="RO"
        onPress={() => {
          dispatch(setGameLanguage('ro'));
          setStoreData('language', 'ro');
          resetGame();
        }}
      />
    </View>
  );
}
