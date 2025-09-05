import { Router } from "express";
import { cadastro, login} from "../controllers/authController.js";

const router = Router();

//cadastro
router.post("/cadastro", cadastro);

//login
router.post("login", login);

export default router;