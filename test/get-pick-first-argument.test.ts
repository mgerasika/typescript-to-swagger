import { expect } from "@jest/globals";
import { getPickFirstArgument } from "../src/utils/get-pick-fields.util";

describe("remove pick", () => {
  it("remove pick default", () => {
    expect(
      getPickFirstArgument("Pick<string,'a' | 'b' >")?.firstArgumentBody
    ).toEqual("string");
    expect(getPickFirstArgument("IA<Pick<string,'a' | 'b' >>")).toBeUndefined();
    expect(
      getPickFirstArgument("Pick<IA<string>,'a' | 'b' >")?.firstArgumentBody
    ).toEqual("IA<string>");
  });
});
