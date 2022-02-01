import { renderHook } from "@testing-library/react-hooks";
import useGranularEffect from "../../src/hooks/useGranularEffect";

const log = jest.fn();

beforeAll(() => {
  log.mockClear();
});

describe("when there are no dependencies", () => {
  it("calls the effect once", () => {
    const effect = jest.fn();
    renderHook(() => useGranularEffect(effect, [], []));

    expect(effect).toBeCalledTimes(1);
  });

  it("calls the cleanup function when unmounting", () => {
    const cleanup = jest.fn();
    const effect = () => cleanup;
    const { unmount } = renderHook(() => useGranularEffect(effect, [], []));

    unmount();

    expect(cleanup).toBeCalledTimes(1);
  });

  it("does not call the cleanup function without unmounting", () => {
    const cleanup = jest.fn();
    const effect = () => cleanup;
    renderHook(() => useGranularEffect(effect, [], []));

    expect(cleanup).not.toBeCalled();
  });
});

describe("when there are only primary dependencies", () => {
  it("calls the effect once when mounting", () => {
    const effect = jest.fn();
    const primaryDeps = [true];
    renderHook(() => useGranularEffect(effect, primaryDeps, []));

    expect(effect).toBeCalledTimes(1);
  });

  it("calls the effect when the primary dependencies change", () => {
    const effect = jest.fn();
    let primaryDeps = [true];
    const { rerender } = renderHook(() =>
      useGranularEffect(effect, primaryDeps, [])
    );

    expect(effect).toBeCalledTimes(1);

    primaryDeps = [false];
    rerender();

    expect(effect).toBeCalledTimes(2);
  });

  it("calls the effect when any of the primary dependencies change", () => {
    const effect = jest.fn();
    let primaryDeps = [true, 1, "a"];
    const { rerender } = renderHook(() =>
      useGranularEffect(effect, primaryDeps, [])
    );

    expect(effect).toBeCalledTimes(1);

    primaryDeps = [false, 1, "a"];
    rerender();

    expect(effect).toBeCalledTimes(2);
  });

  it("does not call the effect again when the primary dependencies haven't changed", () => {
    const effect = jest.fn();
    let primaryDeps = [true];
    const { rerender } = renderHook(() =>
      useGranularEffect(effect, primaryDeps, [])
    );

    expect(effect).toBeCalledTimes(1);

    primaryDeps = [true];
    rerender();

    expect(effect).toBeCalledTimes(1);
  });

  it("does not calls the effect when the identity of the primary dependencies hasn't changed", () => {
    const effect = jest.fn();
    const obj = { value: true };
    const primaryDeps = [obj];
    const { rerender } = renderHook(() =>
      useGranularEffect(effect, primaryDeps, [])
    );

    expect(effect).toBeCalledTimes(1);

    obj.value = false;
    rerender();

    expect(effect).toBeCalledTimes(1);
  });

  it("calls the cleanup function when the primary dependencies change", () => {
    const cleanup = jest.fn();
    const effect = () => cleanup;
    let primaryDeps = [true];
    const { rerender } = renderHook(() =>
      useGranularEffect(effect, primaryDeps, [])
    );

    expect(cleanup).not.toBeCalled();

    primaryDeps = [false];
    rerender();

    expect(cleanup).toBeCalledTimes(1);
  });

  it("does not call the cleanup function when the primary dependencies haven't changed", () => {
    const cleanup = jest.fn();
    const effect = () => cleanup;
    let primaryDeps = [true];
    const { rerender } = renderHook(() =>
      useGranularEffect(effect, primaryDeps, [])
    );

    expect(cleanup).not.toBeCalled();

    primaryDeps = [true];
    rerender();

    expect(cleanup).not.toBeCalled();
  });
});

describe("when there are only secondary dependencies", () => {
  it("calls the effect once when mounting", () => {
    const effect = jest.fn();
    const secondaryDeps = [true];
    renderHook(() => useGranularEffect(effect, [], secondaryDeps));

    expect(effect).toBeCalledTimes(1);
  });

  it("does not call the effect when the secondary dependencies change", () => {
    const effect = jest.fn();
    let secondaryDeps = [true];
    const { rerender } = renderHook(() =>
      useGranularEffect(effect, [], secondaryDeps)
    );

    expect(effect).toBeCalledTimes(1);

    secondaryDeps = [false];
    rerender();

    expect(effect).toBeCalledTimes(1);
  });

  it("does not call the cleanup function when the secondary dependencies change", () => {
    const cleanup = jest.fn();
    const effect = () => cleanup;
    let secondaryDeps = [true];
    const { rerender } = renderHook(() =>
      useGranularEffect(effect, [], secondaryDeps)
    );

    expect(cleanup).not.toBeCalled();

    secondaryDeps = [false];
    rerender();

    expect(cleanup).not.toBeCalled();
  });
});

describe("when there are both primary and secondary dependencies", () => {
  it("calls the effect once when mounting", () => {
    const effect = jest.fn();
    const primaryDeps = ["a", "b", "c"];
    const secondaryDeps = [1, 2, 3];
    renderHook(() => useGranularEffect(effect, primaryDeps, secondaryDeps));

    expect(effect).toBeCalledTimes(1);
  });

  it("calls the effect when the primary dependencies change", () => {
    const effect = jest.fn();
    let primaryDeps = ["a", "b", "c"];
    const secondaryDeps = [1, 2, 3];
    const { rerender } = renderHook(() =>
      useGranularEffect(effect, primaryDeps, secondaryDeps)
    );

    expect(effect).toBeCalledTimes(1);

    primaryDeps = ["d", "e", "f"];
    rerender();

    expect(effect).toBeCalledTimes(2);
  });

  it("calls the effect when both the primary and secondary dependencies change", () => {
    const effect = jest.fn();
    let primaryDeps = ["a", "b", "c"];
    let secondaryDeps = [1, 2, 3];
    const { rerender } = renderHook(() =>
      useGranularEffect(effect, primaryDeps, secondaryDeps)
    );

    expect(effect).toBeCalledTimes(1);

    primaryDeps = ["d", "e", "f"];
    secondaryDeps = [4, 5, 6];
    rerender();

    expect(effect).toBeCalledTimes(2);
  });

  it("does not call the effect when only the secondary dependencies change", () => {
    const effect = jest.fn();
    const primaryDeps = ["a", "b", "c"];
    let secondaryDeps = [1, 2, 3];
    const { rerender } = renderHook(() =>
      useGranularEffect(effect, primaryDeps, secondaryDeps)
    );

    expect(effect).toBeCalledTimes(1);

    secondaryDeps = [4, 5, 6];
    rerender();

    expect(effect).toBeCalledTimes(1);
  });

  it("calls the cleanup function when the primary dependencies change", () => {
    const cleanup = jest.fn();
    const effect = () => cleanup;
    let primaryDeps = ["a", "b", "c"];
    const secondaryDeps = [1, 2, 3];
    const { rerender } = renderHook(() =>
      useGranularEffect(effect, primaryDeps, secondaryDeps)
    );

    expect(cleanup).not.toBeCalled();

    primaryDeps = ["d", "e", "f"];
    rerender();

    expect(cleanup).toBeCalledTimes(1);
  });

  it("calls the cleanup function when both the primary and secondary dependencies change", () => {
    const cleanup = jest.fn();
    const effect = () => cleanup;
    let primaryDeps = ["a", "b", "c"];
    let secondaryDeps = [1, 2, 3];
    const { rerender } = renderHook(() =>
      useGranularEffect(effect, primaryDeps, secondaryDeps)
    );

    expect(cleanup).not.toBeCalled();

    primaryDeps = ["d", "e", "f"];
    secondaryDeps = [4, 5, 6];
    rerender();

    expect(cleanup).toBeCalledTimes(1);
  });

  it("does not call the cleanup function when the secondary dependencies change", () => {
    const cleanup = jest.fn();
    const effect = () => cleanup;
    const primaryDeps = ["a", "b", "c"];
    let secondaryDeps = [1, 2, 3];
    const { rerender } = renderHook(() =>
      useGranularEffect(effect, primaryDeps, secondaryDeps)
    );

    expect(cleanup).not.toBeCalled();

    secondaryDeps = [4, 5, 6];
    rerender();

    expect(cleanup).not.toBeCalled();
  });

  it("calls the effect with updated dependencies", () => {
    let prim1 = "a";
    let prim2 = "b";
    let sec1 = 1;
    let sec2 = 2;
    const effect = () => log(prim1, prim2, sec1, sec2);

    const { rerender } = renderHook(() =>
      useGranularEffect(effect, [prim1, prim2], [sec1, sec2])
    );

    expect(log).toBeCalledWith(prim1, prim2, sec1, sec2);

    prim1 = "c";
    prim2 = "d";
    sec1 = 3;
    sec2 = 4;
    rerender();

    expect(log).toBeCalledWith(prim1, prim2, sec1, sec2);
  });
});
