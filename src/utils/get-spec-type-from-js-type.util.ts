export const getSpecTypeFromJsType = (type: string): string => {
  if (type === "number") {
    return "integer";
  }
  return type;
};
