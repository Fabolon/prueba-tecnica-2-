import Ruleta from "../models/ruleta.js";
import Apuesta from "../models/apuesta.js";

// Crear ruleta
export const crearRuleta = async (req, res) => {
  try {
    const ruleta = await Ruleta.create({});
    res.status(201).json({ mensaje: "Ruleta creada", ruletaId: ruleta._id });
  } catch (error) {
    res.status(500).json({ error: "Error creando la ruleta" });
  }
};

// Abrir ruleta
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

// Realizar apuesta
export const apostar = async (req, res) => {
  try {
    const { ruletaId } = req.params;
    const { tipo, numero, color, valorApostado } = req.body;

    const ruleta = await Ruleta.findById(ruletaId);

    if (!ruleta) return res.status(404).json({ error: "Ruleta no encontrada" });
    if (ruleta.estado !== "abierta")
      return res.status(400).json({ error: "La ruleta está cerrada" });

    if (valorApostado > 10000)
      return res.status(400).json({ error: "Máximo permitido: 10.000" });

    const apuesta = await Apuesta.create({
      ruletaId,
      tipo,
      numero,
      color,
      valorApostado
    });

    ruleta.apuestas.push(apuesta._id);
    await ruleta.save();

    res.status(201).json({ mensaje: "Apuesta registrada", apuesta });
  } catch (error) {
    res.status(500).json({ error: "Error al apostar" });
  }
};

// Cerrar ruleta y calcular ganadores
export const cerrarRuleta = async (req, res) => {
  try {
    const { id } = req.params;
    const ruleta = await Ruleta.findById(id).populate("apuestas");

    if (!ruleta) return res.status(404).json({ error: "Ruleta no encontrada" });

    // Generar número ganador
    const numeroGanador = Math.floor(Math.random() * 37);
    const colorGanador = numeroGanador % 2 === 0 ? "rojo" : "negro";

    ruleta.estado = "cerrada";
    ruleta.numeroGanador = numeroGanador;
    ruleta.colorGanador = colorGanador;

    // Evaluar apuestas
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

// Listar ruletas
export const listarRuletas = async (req, res) => {
  try {
    const ruletas = await Ruleta.find();
    res.json(ruletas);
  } catch (error) {
    res.status(500).json({ error: "Error listando ruletas" });
  }
};
