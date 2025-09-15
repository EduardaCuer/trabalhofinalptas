const express = require ("express");
const app = express();

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello people!");
});

const UsuarioController = require("./controllers/UsuarioController");

const authRoutes = require("./routes/authRoutes");
app.use("/cadastro", UsuarioController.verificarAutenticacao, authRoutes);

const authRoutes = require("./routes/authRoutes");
app.use("/cadastro", UsuarioController.verificarAutenticacao, authRoutes);

