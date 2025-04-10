import * as React from 'react';

type Updater<T> = T | ((prevState: T) => T);
type UseControllableStateParams<T> = {
  prop?: T;
  defaultProp?: T;
  onChange?: (state: T) => void;
};

export function useControllableState<T>({
  prop,
  defaultProp,
  onChange = () => {},
}: UseControllableStateParams<T>): [T, (updater: Updater<T>) => void] {
  const [internalState, setInternalState] = React.useState(defaultProp as T);
  const isControlled = prop !== undefined;
  const stateRef = React.useRef(isControlled ? prop : internalState);

  // Update refs for latest values
  const isControlledRef = React.useRef(isControlled);
  const onChangeRef = React.useRef(onChange);

  React.useEffect(() => {
    isControlledRef.current = isControlled;
    onChangeRef.current = onChange;
    stateRef.current = isControlled ? prop! : internalState;
  });

  const setState = React.useCallback((updater: Updater<T>) => {
    const newValue =
      typeof updater === 'function'
        ? (updater as (prev: T) => T)(stateRef.current)
        : updater;

    // Update parent if controlled
    if (isControlledRef.current) {
      onChangeRef.current(newValue);
    }
    // Update internal state if uncontrolled
    else {
      setInternalState(newValue);
      onChangeRef.current(newValue);
    }
  }, []);

  return [isControlled ? prop! : internalState, setState];
}
