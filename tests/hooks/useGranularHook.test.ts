import { renderHook } from "@testing-library/react-hooks";
import useGranularHook from "../../src/hooks/useGranularHook";

describe("when there are no dependencies", () => {
  it("calls the hook with an empty array", () => {
    const hook = jest.fn();
    const callback = jest.fn();
    renderHook(() => useGranularHook(hook, callback, [], []));

    expect(hook).toBeCalledWith(callback, []);
  });
});

describe("when there are only primary dependencies", () => {
  it("calls the hook with the primary dependencies", () => {
    const hook = jest.fn();
    const callback = jest.fn();
    const primaryDeps = [true];
    renderHook(() => useGranularHook(hook, callback, primaryDeps, []));

    expect(hook).toBeCalledWith(callback, primaryDeps);
  });

  it("calls the hook with updated values when the primary dependencies change", () => {
    const hook = jest.fn();
    const callback = jest.fn();
    let primaryDeps = [true];
    const { rerender } = renderHook(() =>
      useGranularHook(hook, callback, primaryDeps, [])
    );

    expect(hook).toBeCalledWith(callback, primaryDeps);

    primaryDeps = [false];
    rerender();

    expect(hook).toBeCalledWith(callback, primaryDeps);
  });
});

describe("when there are only secondary dependencies", () => {
  it("calls the hook with secondary dependencies", () => {
    const hook = jest.fn();
    const callback = jest.fn();
    const secondaryDeps = [true];
    renderHook(() => useGranularHook(hook, callback, [], secondaryDeps));

    expect(hook).toBeCalledWith(callback, secondaryDeps);
  });

  it("always calls the hook with the initial value of the secondary dependencies", () => {
    const hook = jest.fn();
    const callback = jest.fn();
    const initialValues = [true];
    let secondaryDeps = [...initialValues];
    const { rerender } = renderHook(() =>
      useGranularHook(hook, callback, [], secondaryDeps)
    );

    expect(hook).toBeCalledWith(callback, initialValues);

    secondaryDeps = [false];
    rerender();

    expect(hook).toBeCalledWith(callback, initialValues);
  });
});

describe("when there are both primary and secondary dependencies", () => {
  it("calls the hook with all dependencies", () => {
    const hook = jest.fn();
    const callback = jest.fn();
    const primaryDeps = ["a", "b", "c"];
    const secondaryDeps = [1, 2, 3];
    renderHook(() =>
      useGranularHook(hook, callback, primaryDeps, secondaryDeps)
    );

    expect(hook).toBeCalledWith(callback, [...primaryDeps, ...secondaryDeps]);
  });

  it("calls the hook with updated values when the primary dependencies change", () => {
    const hook = jest.fn();
    const callback = jest.fn();
    let primaryDeps = ["a", "b", "c"];
    const secondaryDeps = [1, 2, 3];
    const { rerender } = renderHook(() =>
      useGranularHook(hook, callback, primaryDeps, secondaryDeps)
    );

    expect(hook).toBeCalledWith(callback, [...primaryDeps, ...secondaryDeps]);

    primaryDeps = ["d", "e", "f"];
    rerender();

    expect(hook).toBeCalledWith(callback, [...primaryDeps, ...secondaryDeps]);
  });

  it("calls the hook with updated values when both the primary and secondary dependencies change", () => {
    const hook = jest.fn();
    const callback = jest.fn();
    let primaryDeps = ["a", "b", "c"];
    let secondaryDeps = [1, 2, 3];
    const { rerender } = renderHook(() =>
      useGranularHook(hook, callback, primaryDeps, secondaryDeps)
    );

    expect(hook).toBeCalledWith(callback, [...primaryDeps, ...secondaryDeps]);

    primaryDeps = ["d", "e", "f"];
    secondaryDeps = [4, 5, 6];
    rerender();

    expect(hook).toBeCalledWith(callback, [...primaryDeps, ...secondaryDeps]);
  });

  it("calls the hook with previous values when only the secondary dependencies change", () => {
    const hook = jest.fn();
    const callback = jest.fn();
    const primaryDeps = ["a", "b", "c"];
    let secondaryDeps = [1, 2, 3];
    const { rerender } = renderHook(() =>
      useGranularHook(hook, callback, primaryDeps, secondaryDeps)
    );

    expect(hook).toBeCalledWith(callback, [...primaryDeps, ...secondaryDeps]);

    const previousSecondaryDeps = [...secondaryDeps];
    secondaryDeps = [4, 5, 6];
    rerender();

    expect(hook).toBeCalledWith(callback, [
      ...primaryDeps,
      ...previousSecondaryDeps,
    ]);
  });
});
