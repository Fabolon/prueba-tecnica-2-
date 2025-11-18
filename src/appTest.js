import express from "express";
import {
  crearRuleta,
  abrirRuleta,
  apostar,
  cerrarRuleta,
  listarRuletas
} from "./controllers/ruleta.controller.js";

const app = express();
// Permite recibir cuerpos JSON en las peticiones durante las pruebas
app.use(express.json());

// Endpoints expuestos exclusivamente para tests de integracion
app.post("/ruletas", crearRuleta);
app.put("/ruletas/:id/abrir", abrirRuleta);
app.post("/ruletas/:ruletaId/apostar", apostar);

export default app;
