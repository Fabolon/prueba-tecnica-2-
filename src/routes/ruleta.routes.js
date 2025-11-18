import express from "express";
import {
  crearRuleta,
  abrirRuleta,
  apostar,
  cerrarRuleta,
  listarRuletas
} from "../controllers/ruleta.controller.js";

const router = express.Router();

// Alta de una nueva ruleta
router.post("/", crearRuleta);
// Pone una ruleta en estado abierto para aceptar apuestas
router.put("/:id/abrir", abrirRuleta);
// Registra una apuesta sobre una ruleta especifica
router.post("/:ruletaId/apostar", apostar);
// Cierra la ruleta y calcula resultados
router.put("/:id/cerrar", cerrarRuleta);
// Devuelve todas las ruletas registradas
router.get("/", listarRuletas);

export default router;
