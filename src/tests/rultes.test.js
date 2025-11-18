import request from "supertest";
import app from "../appTest.js";

// Simulamos el modelo de Ruleta para no tocar la base real en las pruebas
jest.mock("../models/ruleta.js", () => {
  const saveMock = jest.fn().mockResolvedValue(true);
  return {
    default: jest.fn().mockImplementation(() => ({
      _id: "1",
      estado: "cerrada",
      apuestas: [],
      save: saveMock
    })),
    create: jest.fn().mockResolvedValue({
      _id: "1",
      estado: "cerrada",
      apuestas: [],
      save: saveMock
    }),
    findById: jest.fn().mockResolvedValue({
      _id: "1",
      estado: "abierta",
      apuestas: [],
      save: saveMock
    })
  };
});

// Tambien simulamos el modelo de apuestas para aislar las reglas de negocio
jest.mock("../models/apuesta.js", () => {
  return {
    default: {
      create: jest.fn().mockResolvedValue({
        _id: "10",
        tipo: "numero",
        numero: 7,
        valorApostado: 50
      })
    }
  };
});

describe("Pruebas de integracion de ruleta", () => {
  test("Debe crear una ruleta", async () => {
    const res = await request(app).post("/ruletas");

    expect(res.statusCode).toBe(201);
    expect(res.body.mensaje).toBe("Ruleta creada");
    expect(res.body.ruletaId).toBe("1");
  });

  test("Debe abrir una ruleta y apostar", async () => {
    // Validamos que el endpoint de apertura responda correctamente
    const resAbrir = await request(app).put("/ruletas/1/abrir");
    expect(resAbrir.statusCode).toBe(200);
    expect(resAbrir.body.mensaje).toBe("Ruleta abierta correctamente");

    // Luego enviamos una apuesta para confirmar que se registre
    const resApuesta = await request(app)
      .post("/ruletas/1/apostar")
      .send({
        tipo: "numero",
        numero: 7,
        valorApostado: 50
      });

    expect(resApuesta.statusCode).toBe(201);
    expect(resApuesta.body.mensaje).toBe("Apuesta registrada");
    expect(resApuesta.body.apuesta.tipo).toBe("numero");
    expect(resApuesta.body.apuesta.valorApostado).toBe(50);
  });
});
