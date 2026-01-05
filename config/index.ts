import { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import express from "express";

export default (app: Application): void => {
  app.use(cors());
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
};
