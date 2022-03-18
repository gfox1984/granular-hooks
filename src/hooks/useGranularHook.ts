import { DependencyList, useRef } from "react";

type HookWithDependencies<C, R> = (callback: C, deps: DependencyList) => R;

const useGranularHook = <T extends HookWithDependencies<C, ReturnType<T>>, C>(
  hook: T,
  callback: C,
  primaryDeps: DependencyList,
  secondaryDeps: DependencyList
) => {
  const ref = useRef<DependencyList>();

  if (
    !ref.current ||
    !primaryDeps.every((w, i) => Object.is(w, ref.current[i]))
  )
    ref.current = [...primaryDeps, ...secondaryDeps];

  return hook(callback, ref.current);
};

export default useGranularHook;
