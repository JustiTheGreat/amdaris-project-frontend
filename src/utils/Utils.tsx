import { jwtDecode } from "jwt-decode";
import adminProfilePicture from "../assets/admin_profile_picture.svg";
import { UserRole } from "./UserRoles";

export const AppName = "ContestCraft";

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

export const getUserObjectFromToken = (token: string | null) => {
  if (!token) return undefined;
  const decodedToken: any = jwtDecode(token);
  const role: UserRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  const playerId: string = decodedToken["PlayerId"];
  const profilePictureUri: string | null =
    role === UserRole.Administrator ? adminProfilePicture : decodedToken["ProfilePictureUri"] ?? null;
  const firstName: string = decodedToken["FirstName"];
  const lastName: string = decodedToken["LastName"];
  const username: string = decodedToken["Username"];
  const email: string = decodedToken["Email"];
  return {
    role: role,
    playerId: playerId,
    profilePictureUri: profilePictureUri,
    firstName: firstName,
    lastName: lastName,
    username: username,
    email: email,
  };
};

export const addZeroBefore = (nr: number) => (nr >= 0 ? `${nr < 10 ? `0${nr}` : nr}` : `${nr > -10 ? `-0${-nr}` : nr}`);

export const formatDate = (date: Date | null | undefined): string => {
  if (!date) return "-";
  const localDate = new Date(date.toLocaleString());
  return `${addZeroBefore(localDate.getDay())}/${addZeroBefore(localDate.getDate())}/${addZeroBefore(
    localDate.getFullYear()
  )} ${addZeroBefore(localDate.getHours())}:${addZeroBefore(localDate.getMinutes())}`;
};
