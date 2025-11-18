import express from 'express';
import dotenv from 'dotenv';
import { mongooseContecion } from "./src/config/db.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT ;

mongooseContecion();