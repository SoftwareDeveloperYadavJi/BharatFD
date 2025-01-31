import express from "express";
import { addFAQ, getFAQs , updateFAQ, deleteFAQ} from "../controllers/faqController.js";

const faqRouter = express.Router();


faqRouter.post("/add", addFAQ);
faqRouter.get("/all", getFAQs);
faqRouter.put("/:id", updateFAQ);
faqRouter.delete("/:id", deleteFAQ);


export default faqRouter;