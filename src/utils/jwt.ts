import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;


export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, JWT_REFRESH_SECRET) as {
    id: number;
  };
};
export const generateAccessToken = (id: number) => {
  return jwt.sign(
    { id },
    JWT_SECRET,
    {
      expiresIn: "15m",
    }
  );
};
export const generateTokens = (id: number) => {

  const accessToken = jwt.sign(
    { id },
    JWT_SECRET,
    {
      expiresIn: "15m",
    }
  );

  const refreshToken = jwt.sign(
    { id },
    JWT_REFRESH_SECRET,
    {
      expiresIn: "7d",
    }
  );

  return {
    accessToken,
    refreshToken,
  };
};