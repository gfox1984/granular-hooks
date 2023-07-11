import { DependencyList, useMemo } from "react";
import useGranularHook from "./useGranularHook";

const useGranularMemo = <T>(
  factory: () => T,
  primaryDeps: DependencyList,
  secondaryDeps: DependencyList
) => useGranularHook(useMemo, factory, primaryDeps, secondaryDeps) as T;

export default useGranularMemo;
