import { DependencyList, useCallback } from "react";
import useGranularHook from "./useGranularHook";

// disable warning: useGranularCallback has the same signature as useCallback
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useGranularCallback = <T extends (...args: any[]) => any>(
  callback: T,
  primaryDeps: DependencyList,
  secondaryDeps: DependencyList
) => useGranularHook(useCallback, callback, primaryDeps, secondaryDeps);

export default useGranularCallback;
