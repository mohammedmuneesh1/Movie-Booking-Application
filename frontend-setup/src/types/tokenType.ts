
export interface JwtPayloadInterface {
  userId: string;
  email: string;
  ia:boolean;
  iat: number;
  exp: number;
}