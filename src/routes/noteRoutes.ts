import { Router } from "express";
import { createNote, getAbout, getAllNotes, getNoteById, getUserName, searchNote, updateNote,deleteNote } from "../controller/noteController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
const router = Router();

router.get("/notes",verifyToken, getAllNotes);
router.get("/notes/:id",verifyToken,getNoteById);
router.get("/about",verifyToken,getAbout);
router.get("/users/:name",verifyToken,getUserName);
router.get("/search",verifyToken,searchNote);
router.post("/notes",verifyToken,createNote);
router.put("/notes/:id",verifyToken,updateNote);
router.delete("/notes/:id", verifyToken,deleteNote);
export default router;
