import { expect } from "@jest/globals";
import { IInterfaceInfo } from "../src/interface-info.interface";
import { IPropertyInfo } from "../src/property-info.interface";
import { getInterfaceProperties } from "../src/utils/get-interface-properties.util";

describe("get-interface-properties", () => {
  it("default", () => {
    expect(getInterfaceProperties("{x:number}")).toEqual([
      { name: "x", type: "number" },
    ]);

    expect(getInterfaceProperties("{x:number,y:number;z:number }")).toEqual([
      { name: "x", type: "number" },
      { name: "y", type: "number" },
      { name: "z", type: "number" },
    ]);
  });
});
