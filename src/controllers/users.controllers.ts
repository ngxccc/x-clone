import { Request, Response } from "express";

export const loginController = (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (email === "ngxc@gmail.com" && password === "123123") {
    return res.json({
      message: "Login success!",
    });
  }

  return res.json({
    error: "Login failed!",
  });
};
