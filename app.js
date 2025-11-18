import express from "express";
import dotenv from "dotenv";
import { mongooseContecion } from "./src/config/db.js";

// Cargamos las variables de entorno declaradas en .env
dotenv.config();
const app = express();

// Puerto expuesto por la aplicacion (se usa al iniciar el server real)
const PORT = process.env.PORT;

// Abrimos la conexion a MongoDB apenas levanta el servidor
mongooseContecion();
