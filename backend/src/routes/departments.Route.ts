import express from "express";
import * as Departments from "../controllers/departments";

const router = express.Router();

router.get("/departments", Departments.getDepartments);

router.post("/departments", Departments.createDepartments);

export default router;