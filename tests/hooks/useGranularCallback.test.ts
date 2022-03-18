import { renderHook } from "@testing-library/react-hooks";
import useGranularCallback from "../../src/hooks/useGranularCallback";

describe("when there are no dependencies", () => {
  it("returns the callback when mounting", () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useGranularCallback(callback, [], []));

    expect(result.current).toBe(callback);
  });

  it("returns the same callback when it rerenders", () => {
    let callback = jest.fn();
    const { rerender, result } = renderHook(() =>
      useGranularCallback(callback, [], [])
    );

    expect(result.current).toBe(callback);

    const previous = callback;
    callback = jest.fn();
    rerender();

    expect(result.current).toBe(previous);
  });

  it("does not call the callback", () => {
    const callback = jest.fn();
    renderHook(() => useGranularCallback(callback, [], []));

    expect(callback).not.toBeCalled();
  });
});

describe("when there are only primary dependencies", () => {
  it("returns the callback when mounting", () => {
    const callback = jest.fn();
    const primaryDeps = [true];
    const { result } = renderHook(() =>
      useGranularCallback(callback, primaryDeps, [])
    );

    expect(result.current).toBe(callback);
  });

  it("returns the updated callback when the primary dependencies change", () => {
    let callback = jest.fn();
    let primaryDeps = [true];
    const { rerender, result } = renderHook(() =>
      useGranularCallback(callback, primaryDeps, [])
    );

    expect(result.current).toBe(callback);

    callback = jest.fn();
    primaryDeps = [false];
    rerender();

    expect(result.current).toBe(callback);
  });

  it("returns the updated callback when any of the primary dependencies change", () => {
    let callback = jest.fn();
    let primaryDeps = [true, 1, "a"];
    const { rerender, result } = renderHook(() =>
      useGranularCallback(callback, primaryDeps, [])
    );

    expect(result.current).toBe(callback);

    callback = jest.fn();
    primaryDeps = [false, 1, "a"];
    rerender();

    expect(result.current).toBe(callback);
  });

  it("returns the previous callback when the primary dependencies haven't changed", () => {
    let callback = jest.fn();
    let primaryDeps = [true];
    const { rerender, result } = renderHook(() =>
      useGranularCallback(callback, primaryDeps, [])
    );

    expect(result.current).toBe(callback);

    const previous = callback;
    callback = jest.fn();
    primaryDeps = [true];
    rerender();

    expect(result.current).toBe(previous);
  });

  it("returns the previous callback when the identity of the primary dependencies hasn't changed", () => {
    let callback = jest.fn();
    const obj = { value: true };
    const primaryDeps = [obj];
    const { rerender, result } = renderHook(() =>
      useGranularCallback(callback, primaryDeps, [])
    );

    expect(result.current).toBe(callback);

    const previous = callback;
    callback = jest.fn();
    obj.value = false;
    rerender();

    expect(result.current).toBe(previous);
  });
});

describe("when there are only secondary dependencies", () => {
  it("returns the callback when mounting", () => {
    const callback = jest.fn();
    const secondaryDeps = [true];
    const { result } = renderHook(() =>
      useGranularCallback(callback, [], secondaryDeps)
    );

    expect(result.current).toBe(callback);
  });

  it("returns the previous callback when the secondary dependencies change", () => {
    let callback = jest.fn();
    let secondaryDeps = [true];
    const { rerender, result } = renderHook(() =>
      useGranularCallback(callback, [], secondaryDeps)
    );

    expect(result.current).toBe(callback);

    const previous = callback;
    callback = jest.fn();
    secondaryDeps = [false];
    rerender();

    expect(result.current).toBe(previous);
  });
});

describe("when there are both primary and secondary dependencies", () => {
  it("returns the callback when mounting", () => {
    const primaryDeps = ["a", "b", "c"];
    const secondaryDeps = [1, 2, 3];
    const callback = jest.fn();
    const { result } = renderHook(() =>
      useGranularCallback(callback, primaryDeps, secondaryDeps)
    );

    expect(result.current).toEqual(callback);
  });

  it("returns the updated callback when the primary dependencies change", () => {
    let primaryDeps = ["a", "b", "c"];
    const secondaryDeps = [1, 2, 3];
    let callback = jest.fn();
    const { rerender, result } = renderHook(() =>
      useGranularCallback(callback, primaryDeps, secondaryDeps)
    );

    expect(result.current).toEqual(callback);

    callback = jest.fn();
    primaryDeps = ["d", "e", "f"];
    rerender();

    expect(result.current).toEqual(callback);
  });

  it("returns the updated callback when both the primary and secondary dependencies change", () => {
    let primaryDeps = ["a", "b", "c"];
    let secondaryDeps = [1, 2, 3];
    let callback = jest.fn();
    const { rerender, result } = renderHook(() =>
      useGranularCallback(callback, primaryDeps, secondaryDeps)
    );

    expect(result.current).toEqual(callback);

    callback = jest.fn();
    primaryDeps = ["d", "e", "f"];
    secondaryDeps = [4, 5, 6];
    rerender();

    expect(result.current).toEqual(callback);
  });

  it("returns the previous callback when only the secondary dependencies change", () => {
    const primaryDeps = ["a", "b", "c"];
    let secondaryDeps = [1, 2, 3];
    let callback = jest.fn();
    const { rerender, result } = renderHook(() =>
      useGranularCallback(callback, primaryDeps, secondaryDeps)
    );

    expect(result.current).toEqual(callback);

    const previous = callback;
    callback = jest.fn();
    secondaryDeps = [4, 5, 6];
    rerender();

    expect(result.current).toEqual(previous);
  });

  it("returns a callback with updated dependencies when both the primary and secondary dependencies change", () => {
    let prim1 = "a";
    let prim2 = "b";
    let sec1 = 1;
    let sec2 = 2;
    let callback = jest.fn().mockReturnValue([prim1, prim2, sec1, sec2]);

    const { rerender, result } = renderHook(() =>
      useGranularCallback(callback, [prim1, prim2], [sec1, sec2])
    );

    expect(result.current()).toEqual([prim1, prim2, sec1, sec2]);

    prim1 = "c";
    prim2 = "d";
    sec1 = 3;
    sec2 = 4;
    callback = jest.fn().mockReturnValue([prim1, prim2, sec1, sec2]);
    rerender();

    expect(result.current()).toEqual([prim1, prim2, sec1, sec2]);
  });

  it("returns a callback with updated dependencies when only the primary dependencies change", () => {
    let prim1 = "a";
    let prim2 = "b";
    const sec1 = 1;
    const sec2 = 2;
    let callback = jest.fn().mockReturnValue([prim1, prim2, sec1, sec2]);

    const { rerender, result } = renderHook(() =>
      useGranularCallback(callback, [prim1, prim2], [sec1, sec2])
    );

    expect(result.current()).toEqual([prim1, prim2, sec1, sec2]);

    prim1 = "c";
    prim2 = "d";
    callback = jest.fn().mockReturnValue([prim1, prim2, sec1, sec2]);
    rerender();

    expect(result.current()).toEqual([prim1, prim2, sec1, sec2]);
  });

  it("returns a callback with previous dependencies when only the secondary dependencies change", () => {
    const prim1 = "a";
    const prim2 = "b";
    let sec1 = 1;
    let sec2 = 2;
    let callback = jest.fn().mockReturnValue([prim1, prim2, sec1, sec2]);

    const { rerender, result } = renderHook(() =>
      useGranularCallback(callback, [prim1, prim2], [sec1, sec2])
    );

    expect(result.current()).toEqual([prim1, prim2, sec1, sec2]);

    const previousSec1 = sec1;
    const previousSec2 = sec2;
    sec1 = 3;
    sec2 = 4;
    callback = jest.fn().mockReturnValue([prim1, prim2, sec1, sec2]);
    rerender();

    expect(result.current()).toEqual([
      prim1,
      prim2,
      previousSec1,
      previousSec2,
    ]);
  });
});
