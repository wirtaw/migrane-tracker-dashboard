export interface IUserUpdateDAO {
  birthdate: string;
  latitude: string;
  longitude: string;
  salt: string | null;
  key: string | null;
  isSecurityFinished: boolean | null;
}
