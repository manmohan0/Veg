import { Router } from "express";
import { deploy } from "../controllers/deployController.js";
const deployRouter = Router();
deployRouter.post('/deploy', deploy);
export default deployRouter;
//# sourceMappingURL=deployRoutes.js.map