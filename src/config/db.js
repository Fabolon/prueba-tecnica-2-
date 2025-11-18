import mongoose from "mongoose";

// Se encarga de inicializar la conexion a Mongo tomando la URL del entorno
export const mongooseContecion = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Conexion a la base de datos exitosa");
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
  }
};
