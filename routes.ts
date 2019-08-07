import * as Router from "koa-router";
import { authenticate } from "./controllers/auth";
import * as todo from "./controllers/todo";
import * as user from "./controllers/user";
const router = new Router();

router.post("/todo", authenticate(["admin", "user"]), todo.create);
router.delete("/todo/:id", authenticate(["admin", "user"]), todo.del);
router.get("/todo", authenticate(["admin", "user"]), todo.list);
router.put("/todo/:id", authenticate(["admin", "user"]), todo.update);
router.get("/todo/:id", authenticate("user"), todo.findOne);
router.post("/user", user.create);
router.get("/user", authenticate(["admin", "user"]), user.list);
router.get("/user/:id", authenticate(["admin", "user"]), user.findOne);
router.post("/user/login", user.signIn);

export default router.routes();
