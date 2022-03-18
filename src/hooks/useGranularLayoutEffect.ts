import { EffectCallback, DependencyList, useLayoutEffect } from "react";
import useGranularHook from "./useGranularHook";

const useGranularLayoutEffect = (
  effect: EffectCallback,
  primaryDeps: DependencyList,
  secondaryDeps: DependencyList
) => useGranularHook(useLayoutEffect, effect, primaryDeps, secondaryDeps);

export default useGranularLayoutEffect;
