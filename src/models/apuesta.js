import mongoose from "mongoose";

const apuestaSchema = new mongoose.Schema({
  ruletaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ruleta",
    required: true
  },
  tipo: {
    type: String,
    enum: ["numero", "color"],
   
  },
  valorApostado: {
    type: Number,
    required: true,
    max: 10000
  },
  numero: {
    type: Number,
    min: 0,
    max: 36
  },
  color: {
    type: String,
    enum: ["rojo", "negro"]
  },
  resultado: {
    type: Number,
    default: null
  },
  ganancia: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export default mongoose.model("Apuesta", apuestaSchema);