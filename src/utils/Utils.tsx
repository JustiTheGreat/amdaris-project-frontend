import { jwtDecode } from "jwt-decode";

export const GetCSSConstant = (constantName: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(constantName).trim();

export const formatKeyToSpacedLowercase = (key: string) =>
  key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
    .toLowerCase();

export const formatCamelCaseToReadable = (str: string): string =>
  str
    .split(/(?<=[a-z])(?=[A-Z])/)
    .map((word, index) =>
      index === 0 ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : word.toLowerCase()
    )
    .join(" ");

export const getIndexOfEnumValueString = <ENUM extends string>(
  enumObject: typeof ENUM,
  enumValue: ENUM
): number | undefined =>
  Object.values(enumObject)
    .map((value, i) => {
      return { value, i };
    })
    .find((o) => o.value === enumValue)?.i;

export const getUserObjectFromToken = (token: string) => {
  const decodedToken: any = jwtDecode(token);
  const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  const playerId = decodedToken["PlayerId"];
  return { role: role, playerId: playerId };
};
