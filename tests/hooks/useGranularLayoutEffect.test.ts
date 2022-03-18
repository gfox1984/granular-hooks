import { renderHook } from "@testing-library/react-hooks";
import useGranularLayoutEffect from "../../src/hooks/useGranularLayoutEffect";

const log = jest.fn();

beforeAll(() => {
  log.mockClear();
});

//
// useGranularLayoutEffect and useGranularEffect are very similar.
//
// This test only covers a few cases since useGranularEffect
// already validates most of the scenarios
//

describe("when there are both primary and secondary dependencies", () => {
  it("calls the effect with updated dependencies", () => {
    let prim1 = "a";
    let prim2 = "b";
    let sec1 = 1;
    let sec2 = 2;
    const effect = () => log(prim1, prim2, sec1, sec2);

    const { rerender } = renderHook(() =>
      useGranularLayoutEffect(effect, [prim1, prim2], [sec1, sec2])
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
