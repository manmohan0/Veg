import { Router } from "express";
import { downloadCode, generateCode } from "../controllers/codeController.js";

const codeRouter = Router();

codeRouter.post('/generateCode', generateCode)
codeRouter.post('/downloadCode', downloadCode)

export default codeRouter