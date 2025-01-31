import express from "express";
import { addFAQ } from "../controllers/faqController.js";

const faqRouter = express.Router();


faqRouter.post("/add", addFAQ);



export default faqRouter;