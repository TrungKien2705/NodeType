import express from "express";
import { get, merge } from "lodash";

import { getUserbySessionToken } from "../db/user";

export const isOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;
    const currentId = get(req, "identity._id") as string;

    if (!currentId) {
      return res.sendStatus(403);
    }
    if (currentId.toString() !== id) {
      return res.sendStatus(403);
    }
    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken = req.cookies["AUTH"];

    if (!sessionToken) {
      return res.sendStatus(403);
    }

    const existingUser = await getUserbySessionToken(sessionToken);

    if (!existingUser) {
      return res.sendStatus(403);
    }
    merge(req, { identity: existingUser });

    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};
