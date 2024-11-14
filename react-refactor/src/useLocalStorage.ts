import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';

export default function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const [internalState, setInternalState] = useState<T>(() => {
    try {
      const storageState = localStorage.getItem(key);
      return storageState ? JSON.parse(storageState) : initialValue;
    } catch (err) {
      console.error('Error retrieving state from localStorage:', err);
      return initialValue;
    }
  });
  const setValue = useCallback<Dispatch<SetStateAction<T>>>(
    (value) => {
      try {
        const valueToStore =
          value instanceof Function ? value(internalState) : value;
        setInternalState(valueToStore ?? initialValue);
        localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (err) {
        console.error(err);
      }
    },
    [key, setInternalState, internalState, initialValue]
  );

  // update the state when storage changes in another tab
  useEffect(() => {
    function handleStorage() {
      try {
        const latestValue = localStorage.getItem(key);
        if (latestValue) {
          setValue(JSON.parse(latestValue));
        }
      } catch (err) {
        console.error(err);
      }
    }
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, []);
  return [internalState, setValue];
}
