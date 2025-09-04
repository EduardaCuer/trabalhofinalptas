import {PrismaClient} from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const cadastro = async (req, res) => {
try{
    const {nome ,email, password} = req.body;

    if (!nome || !email || !password){
        return res.json({mensagem: "Dados obrigatórios faltando!", erro: true});
    }

    const existe = await prisma.usuario.findUnique({where: {email}});
    if (existe) {
        return res.json({mensagem: "Email já está cadastrado!", erro: true});
    }

    const hash = await bcrypt.hash(password, 10);
    const novo= await prisma.usuario.create({
        data: {nome, email, password: hash}
    });

    const token = jwt.sign(
        {id: novo.id, tipo: novo.tipo},
        process.env.JWT_SECRET,
        {expiresIn: "1h"}
    );

    return res.json({mensagem: "Usuário cadastrado com sucesso!", erro: false, token});
}catch (erro) {
    return res.status(500).json({mensagem: "Erro no cadastro", erro:true});
}
};

export const login = async (req,res) => {
    try{
        const {email, password} = req.body;

        if(!email || !password) {
            return res.json({mensagem: "Dados obrigatórios faltando", erro: true});
        }

        const Usuário = await prisma.usuario.findUnique({where:{email}});
        if (!usuario) {
            return res.json({mensagem: "Usuário não encontrado", erro: true});
        }

        const ok = await bcrypt.compare(password, usuario.password);
        if (!ok) {
            return res.json({mensagem: "Senha incorreta!", erro: true});
        }

        const token = jwt.sign(
            {id: usuario.id, tipo: usuario.tipo},
            process.env.JWT_SECRET,
            {expiresIn: "1h"}
        );

        return res.json({mensagem: "Login realizado com sucesso!", erro: false, token});
    } catch (erro) {
        return res.status(500).json({mensagem: "Erro no login", erro: true});
    }
};
