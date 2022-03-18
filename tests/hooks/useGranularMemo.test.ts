import { renderHook } from "@testing-library/react-hooks";
import useGranularMemo from "../../src/hooks/useGranularMemo";

describe("when there are no dependencies", () => {
  it("calls the factory once and return its result", () => {
    const value = 123;
    const factory = jest.fn().mockReturnValue(value);
    const { result } = renderHook(() => useGranularMemo(factory, [], []));

    expect(factory).toBeCalledTimes(1);
    expect(result.current).toBe(value);
  });
});

describe("when there are only primary dependencies", () => {
  it("calls the factory once and return its result", () => {
    const value = 123;
    const factory = jest.fn().mockReturnValue(value);
    const primaryDeps = [true];
    const { result } = renderHook(() =>
      useGranularMemo(factory, primaryDeps, [])
    );

    expect(factory).toBeCalledTimes(1);
    expect(result.current).toBe(value);
  });

  it("calls the factory when the primary dependencies change", () => {
    const factory = jest.fn();
    let primaryDeps = [true];
    const { rerender } = renderHook(() =>
      useGranularMemo(factory, primaryDeps, [])
    );

    expect(factory).toBeCalledTimes(1);

    primaryDeps = [false];
    rerender();

    expect(factory).toBeCalledTimes(2);
  });

  it("calls the factory when any of the primary dependencies change", () => {
    const factory = jest.fn();
    let primaryDeps = [true, 1, "a"];
    const { rerender } = renderHook(() =>
      useGranularMemo(factory, primaryDeps, [])
    );

    expect(factory).toBeCalledTimes(1);

    primaryDeps = [false, 1, "a"];
    rerender();

    expect(factory).toBeCalledTimes(2);
  });

  it("does not call the factory again when the primary dependencies haven't changed", () => {
    const factory = jest.fn();
    let primaryDeps = [true];
    const { rerender } = renderHook(() =>
      useGranularMemo(factory, primaryDeps, [])
    );

    expect(factory).toBeCalledTimes(1);

    primaryDeps = [true];
    rerender();

    expect(factory).toBeCalledTimes(1);
  });

  it("does not calls the factory when the identity of the primary dependencies hasn't changed", () => {
    const factory = jest.fn();
    const obj = { value: true };
    const primaryDeps = [obj];
    const { rerender } = renderHook(() =>
      useGranularMemo(factory, primaryDeps, [])
    );

    expect(factory).toBeCalledTimes(1);

    obj.value = false;
    rerender();

    expect(factory).toBeCalledTimes(1);
  });
});

describe("when there are only secondary dependencies", () => {
  it("calls the factory once when mounting and return its result", () => {
    const value = 123;
    const factory = jest.fn().mockReturnValue(value);
    const secondaryDeps = [true];
    const { result } = renderHook(() =>
      useGranularMemo(factory, [], secondaryDeps)
    );

    expect(factory).toBeCalledTimes(1);
    expect(result.current).toBe(value);
  });

  it("does not call the factory when the secondary dependencies change", () => {
    const factory = jest.fn();
    let secondaryDeps = [true];
    const { rerender } = renderHook(() =>
      useGranularMemo(factory, [], secondaryDeps)
    );

    expect(factory).toBeCalledTimes(1);

    secondaryDeps = [false];
    rerender();

    expect(factory).toBeCalledTimes(1);
  });
});

describe("when there are both primary and secondary dependencies", () => {
  it("calls the factory once when mounting and it returns it result", () => {
    const primaryDeps = ["a", "b", "c"];
    const secondaryDeps = [1, 2, 3];
    const factory = jest.fn(() => [...primaryDeps, ...secondaryDeps]);
    const { result } = renderHook(() =>
      useGranularMemo(factory, primaryDeps, secondaryDeps)
    );

    expect(factory).toBeCalledTimes(1);
    expect(result.current).toEqual([...primaryDeps, ...secondaryDeps]);
  });

  it("calls the factory when the primary dependencies change and it returns the correct result", () => {
    let primaryDeps = ["a", "b", "c"];
    const secondaryDeps = [1, 2, 3];
    const factory = jest.fn(() => [...primaryDeps, ...secondaryDeps]);
    const { rerender, result } = renderHook(() =>
      useGranularMemo(factory, primaryDeps, secondaryDeps)
    );

    expect(factory).toBeCalledTimes(1);
    expect(result.current).toEqual([...primaryDeps, ...secondaryDeps]);

    primaryDeps = ["d", "e", "f"];
    rerender();

    expect(factory).toBeCalledTimes(2);
    expect(result.current).toEqual([...primaryDeps, ...secondaryDeps]);
  });

  it("calls the factory when both the primary and secondary dependencies change and it returns the correct result", () => {
    let primaryDeps = ["a", "b", "c"];
    let secondaryDeps = [1, 2, 3];
    const factory = jest.fn(() => [...primaryDeps, ...secondaryDeps]);
    const { rerender, result } = renderHook(() =>
      useGranularMemo(factory, primaryDeps, secondaryDeps)
    );

    expect(factory).toBeCalledTimes(1);
    expect(result.current).toEqual([...primaryDeps, ...secondaryDeps]);

    primaryDeps = ["d", "e", "f"];
    secondaryDeps = [4, 5, 6];
    rerender();

    expect(factory).toBeCalledTimes(2);
    expect(result.current).toEqual([...primaryDeps, ...secondaryDeps]);
  });

  it("does not call the factory when only the secondary dependencies change and it returns the previous result", () => {
    const primaryDeps = ["a", "b", "c"];
    let secondaryDeps = [1, 2, 3];
    const factory = jest.fn(() => [...primaryDeps, ...secondaryDeps]);
    const { rerender, result } = renderHook(() =>
      useGranularMemo(factory, primaryDeps, secondaryDeps)
    );

    expect(factory).toBeCalledTimes(1);
    expect(result.current).toEqual([...primaryDeps, ...secondaryDeps]);

    const previousSecondaryDeps = [...secondaryDeps];
    secondaryDeps = [4, 5, 6];
    rerender();

    expect(factory).toBeCalledTimes(1);
    expect(result.current).toEqual([...primaryDeps, ...previousSecondaryDeps]);
  });
});
