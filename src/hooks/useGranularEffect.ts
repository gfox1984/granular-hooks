import { EffectCallback, DependencyList, useEffect } from "react";
import useGranularHook from "./useGranularHook";

const useGranularEffect = (
  effect: EffectCallback,
  primaryDeps: DependencyList,
  secondaryDeps: DependencyList
) => useGranularHook(useEffect, effect, primaryDeps, secondaryDeps);

export default useGranularEffect;
