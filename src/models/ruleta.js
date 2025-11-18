import mongoose from "mongoose";

// Modelo principal que registra el estado y resultado de cada ruleta
const ruletaSchema = new mongoose.Schema(
  {
    estado: {
      type: String,
      enum: ["abierta", "cerrada"],
      default: "cerrada"
    },
    apuestas: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Apuesta"
      }
    ],
    numeroGanador: {
      type: Number,
      default: null
    },
    colorGanador: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

export default mongoose.model("Ruleta", ruletaSchema);
