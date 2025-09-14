const express = require("express");
const cors = require("cors");
const AuthController = require("./controllers/AuthController");

const app = express();
app.use(express.json());

//middleware para capturar erros de parsing JSON
app.use((err, req, res, next) => {
    if(err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({erro: true, mensagem: "Erro de sintaxe no JSON"});
    }
    next();
});

app.use(cors({
    origin: "http://localhost:3000"
}));

//rotas de autenticação
const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

app.listen(8000, () => {
    console.log("Servidor rodando na porta 8000!");
});

module.exports = app;