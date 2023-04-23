import { expect } from "@jest/globals";
import { getOmitFirstArgument } from "../src/utils/get-omit-fields.utils";

describe("remove omit", () => {
  it("remove omit default", () => {
    expect(
      getOmitFirstArgument("Omit<string,'a' | 'b' >")?.firstArgumentBody
    ).toEqual("string");
    expect(getOmitFirstArgument("IA<Omit<string,'a' | 'b' >>")).toBeUndefined();
    expect(
      getOmitFirstArgument("Omit<IA<string>,'a' | 'b' >")?.firstArgumentBody
    ).toEqual("IA<string>");
  });
});
