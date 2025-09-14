const express = require("express");
const AuthController = require("./controllers/AuthController");

const app = express();
app.use(express());

//Rotas de Autenticação
const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

app.listen(8000, () => {
    console.log("Servidor rodando na porta 8000!");
});

module.exports = app;