import express from "express";
import {
  crearRuleta,
  abrirRuleta,
  apostar,
  cerrarRuleta,
  listarRuletas
} from "../controllers/ruleta.controller.js";

const router = express.Router();

router.post("/", crearRuleta);
router.put("/:id/abrir", abrirRuleta);
router.post("/:ruletaId/apostar", apostar);
router.put("/:id/cerrar", cerrarRuleta);
router.get("/", listarRuletas);

export default router;