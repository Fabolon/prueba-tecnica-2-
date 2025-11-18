import Ruleta from "../models/ruleta.js";
import Apuesta from "../models/apuesta.js";

// Crea una ruleta vacia cuyo estado inicial es "cerrada"
export const crearRuleta = async (req, res) => {
  try {
    const ruleta = await Ruleta.create({});
    res.status(201).json({ mensaje: "Ruleta creada", ruletaId: ruleta._id });
  } catch (error) {
    res.status(500).json({ error: "Error creando la ruleta" });
  }
};

// Cambia el estado de la ruleta para aceptar apuestas
export const abrirRuleta = async (req, res) => {
  try {
    const { id } = req.params;
    const ruleta = await Ruleta.findById(id);

    if (!ruleta) {
      return res.status(404).json({ error: "Ruleta no encontrada" });
    }

    ruleta.estado = "abierta";
    await ruleta.save();

    res.json({ mensaje: "Ruleta abierta correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al abrir ruleta" });
  }
};

// Registra una apuesta asociada a una ruleta abierta
export const apostar = async (req, res) => {
  try {
    const { ruletaId } = req.params;
    const { tipo, numero, color, valorApostado } = req.body;

    const ruleta = await Ruleta.findById(ruletaId);

    if (!ruleta) {
      return res.status(404).json({ error: "Ruleta no encontrada" });
    }
    if (ruleta.estado !== "abierta") {
      return res.status(400).json({ error: "La ruleta esta cerrada" });
    }

    // Validamos el limite de dinero permitido por la especificacion
    if (valorApostado > 10000) {
      return res.status(400).json({ error: "Maximo permitido: 10.000" });
    }

    const apuesta = await Apuesta.create({
      ruletaId,
      tipo,
      numero,
      color,
      valorApostado
    });

    // Guardamos la referencia de la apuesta en la ruleta
    ruleta.apuestas.push(apuesta._id);
    await ruleta.save();

    res.status(201).json({ mensaje: "Apuesta registrada", apuesta });
  } catch (error) {
    res.status(500).json({ error: "Error al apostar" });
  }
};

// Cierra la ruleta, define los ganadores y calcula las ganancias
export const cerrarRuleta = async (req, res) => {
  try {
    const { id } = req.params;
    const ruleta = await Ruleta.findById(id).populate("apuestas");

    if (!ruleta) {
      return res.status(404).json({ error: "Ruleta no encontrada" });
    }

    const numeroGanador = Math.floor(Math.random() * 37);
    const colorGanador = numeroGanador % 2 === 0 ? "rojo" : "negro";

    ruleta.estado = "cerrada";
    ruleta.numeroGanador = numeroGanador;
    ruleta.colorGanador = colorGanador;

    const resultados = [];

    for (const apuesta of ruleta.apuestas) {
      let ganancia = 0;

      if (apuesta.tipo === "numero" && apuesta.numero === numeroGanador) {
        ganancia = apuesta.valorApostado * 5;
      }

      if (apuesta.tipo === "color" && apuesta.color === colorGanador) {
        ganancia = apuesta.valorApostado * 1.8;
      }

      apuesta.ganancia = ganancia;
      await apuesta.save();
      resultados.push(apuesta);
    }

    await ruleta.save();

    res.json({
      mensaje: "Ruleta cerrada",
      numeroGanador,
      colorGanador,
      resultados
    });
  } catch (error) {
    res.status(500).json({ error: "Error al cerrar la ruleta" });
  }
};

// Devuelve todas las ruletas registradas con su estado actual
export const listarRuletas = async (req, res) => {
  try {
    const ruletas = await Ruleta.find();
    res.json(ruletas);
  } catch (error) {
    res.status(500).json({ error: "Error listando ruletas" });
  }
};
