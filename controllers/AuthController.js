const prisma = require("../prisma/prismaClient");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

class AuthController {
    //cadastro
    static async cadastro(req, res) {
        const {nome, email, password} = req.body;

        if(!nome || nome.length <3){
            return res.status(422).json({
                erro: true,
                mensagem: "O nome precisa ter no mínimo 3 caracteres!",
            });
        }

        if(!email || email.length <5){
            return res.status(422).json({
                erro: true,
                mensagem: "O email precisa ter no mínimo 5 caracteres!",
            });
        }

        if(!password || password.length <8){
            return res.status(422).json({
                erro: true,
                mensagem: "A senha precisa ter no mínimo 8 caracteres!",
            });
        }

        //verificar se o usuário ja está cadastrado
        const usuarioExistente = await prisma.usuario.count({
            where: {
                email:email,
            },
        });

        if(usuarioExistente != 0){
            return res.json({
                erro: true,
                mensagem: "Este e-mail já está cadastrado por outro usuário!"
            });
        }
        const salt = bcryptjs.genSaltSync(8);
        const hashPassword = bcryptjs.hashPassword(password, salt);

        try{
            const usuario = await prisma.usuario.create({
                data: {
                    nome: nome,
                    email: email,
                    password: hashPassword,
                    tipo: "cliente",
                },
            });

            const token = jwt.sign({id: usuario}, process.env.SECRET_KEY,{
                expiresIn: "1h",
            });

            return res.status(201).json({
                erro: false,
                mensagem: "Usuário foi cadastrado com sucesso!",
                token: token,
                tipo: usuario.tipo,
            });
        } catch (error){
        return res.status(500).json({
            erro:true,
            mensagem:"Ocorreu um erro, tente novamente maias tarde!" + error,
        });
        }
    }

    //login
    static async login(req,res){
        const {email, password}  = req.body;

        try{
            const usuario = await prisma.usuario.findFirst({
                where:{
                    email: email,
                },
            });

            if(!usuario) {
                return res.json({
                    erro: true,
                    mensagem: "Usuário não encontrado!",
                });
            }

            const token = jwt.sign({id:usuario.id}, process.env.SECRET_KEY,{
                expiresIn: "1h",
            });

            res.json({
                erro: false,
                mensagem: "Autenticação foi realizada com sucesso!",
                token: token,
                tipo: usuario.tipo,
            });
        } catch (error) {
            return res.json({
                erro: true,
                mensagem:"Ocorreu um erro ao realizar login" + error.message,
            });
        }
    }

    //verificar autenticação
    static async verificaAutenticacao(req, res, next) {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            return res.status(422).json({message: "Token não identificado!"});
        }

        jwt.verify(token, process.env.SECRET_KEY, (err, payload) => {
            if (err) {
                return res.status(401).json({msg: "Token inválido" }); 
            }

            req.usuario = payload;
            next();
        });
    }

    //middleware para verificar se o usuário é admin
    static async verficaAdmin(req, res, next){
        const usuario = await prisma.usuario.findUnique({
            where:{
                id: req.usuario.id,
            },
        });


        if (usuario.tipo === "admin") {
            next();
        } else {
            return res.status(401).json({
                erro: true,
                mensagem: "Recurso disponível apenas para administradores!",
            });
        }
    }
}

module.exports = AuthController;
