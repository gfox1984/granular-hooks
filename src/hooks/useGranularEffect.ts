import { EffectCallback, DependencyList, useRef, useEffect } from "react";

export const useGranularEffect = (
  effect: EffectCallback,
  primaryDeps: DependencyList,
  secondaryDeps: DependencyList
) => {
  const ref = useRef<DependencyList>();

  if (
    !ref.current ||
    !primaryDeps.every((w, i) => Object.is(w, ref.current[i]))
  )
    ref.current = [...primaryDeps, ...secondaryDeps];

  return useEffect(effect, ref.current);
};
