export const isExternalDefinition = (data: any): boolean => {
  if (typeof data === "string") {
    if (
      data !== "string" &&
      data !== "boolean" &&
      data !== "number" &&
      data !== "Date"
    ) {
      return true;
    }
  }
  return false;
};
