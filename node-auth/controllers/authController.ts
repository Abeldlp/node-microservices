import { Request, Response } from "express";
import { User } from "../models/user.js";
import { User as UserModel } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const user = new User();

interface RegisterRequestBody {
  email: string;
  password: string;
  username: string;
}

interface LoginRequestBody {
  email: string;
  password: string;
}

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    const body: RegisterRequestBody = req.body;

    // Validate that request is correct
    if (!(body.email && body.password && body.username)) {
      // If badRequest abort
      res.status(400).send({
        error: "All fields are required",
      });
      return;
    }
    // hash password with bcrypt
    const hashedPassword: string = await bcrypt.hash(body.password, 10);

    // Create the user
    const createdUser: UserModel | null = await user.create({
      ...body,
      password: hashedPassword,
    });

    if (!createdUser) {
      res.status(400).json({
        message: "Something went wrong",
      });
      return;
    }

    // Generate a token
    const token = jwt.sign(
      {
        id: createdUser.id,
        username: createdUser.username,
        email: createdUser.email,
        role: createdUser?.roleId,
      },
      process.env.JWT_KEY as string,
      { expiresIn: 60 * 60 }
    );

    // Send back token
    res.cookie("access_token", token).sendStatus(201);
  }

  async login(req: Request, res: Response): Promise<void> {
    // validate that request is correct
    const body: LoginRequestBody = req.body;

    // Validate that request is correct
    if (!(body.email && body.password)) {
      // If badRequest abort
      res.sendStatus(400);
      return;
    }
    // Get user where email
    const selectedUser = await user.getByEmail(body.email);

    if (!selectedUser) {
      res.sendStatus(401);
      return;
    }

    // Compare request password to database password
    const correctPassword: boolean = await bcrypt.compare(
      body.password,
      selectedUser.password
    );

    // If not same return unauthorized
    if (!correctPassword) {
      res.sendStatus(401);
      return;
    }

    //Generate new token
    const token = jwt.sign(
      {
        id: selectedUser.id,
        username: selectedUser.username,
        email: selectedUser.email,
        role: selectedUser?.roleId,
      },
      process.env.JWT_KEY as string,
      { expiresIn: 60 * 60 }
    );

    // Set cookie token
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .sendStatus(200);
  }
}
