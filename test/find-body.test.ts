import { expect } from "@jest/globals";
import { findBody } from "../src/utils/find-body.util";

describe("find-interface-body", () => {
  it("default", () => {
    expect(findBody("interface", "interface A {}")).toEqual(["interface A {}"]);
    expect(findBody("interface", "interface A{}")).toEqual(["interface A{}"]);
    expect(
      findBody(
        "interface",
        `interface A{
	  }`
      )
    ).toEqual([`interface A{}`]);
  });

  it("2 interfaces in one file", () => {
    expect(findBody("interface", "interface A {} interface B {}")).toEqual([
      "interface A {}",
      "interface B {}",
    ]);
  });

  it("interfaces with generic", () => {
    expect(findBody("interface", "interface A<string> {}")).toEqual([
      "interface A<string> {}",
    ]);
  });

  it("interfaces with extend", () => {
    expect(findBody("interface", "interface A extend string {}")).toEqual([
      "interface A extend string {}",
    ]);
  });
});
