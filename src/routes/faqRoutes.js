import express from "express";
import { addFAQ, getFAQs } from "../controllers/faqController.js";

const faqRouter = express.Router();


faqRouter.post("/add", addFAQ);
faqRouter.get("/all", getFAQs);



export default faqRouter;