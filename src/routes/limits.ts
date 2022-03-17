import { Request, Response } from "express";
import {LIMITS} from "~/config.js";

export default async (req: Request, res: Response) => {

  res.send(LIMITS)
}
