"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNote = exports.updateNote = exports.createNote = exports.searchNote = exports.getUserName = exports.getNoteById = exports.getAbout = exports.getAllNotes = void 0;
const prisma_js_1 = __importDefault(require("../lib/prisma.js"));
// GET ALL NOTES (Only Logged-in User's Note)
const getAllNotes = async (req, res) => {
    const userId = req.user.id;
    const notes = await prisma_js_1.default.note.findMany({
        where: {
            userId,
        },
    });
    res.status(200).json(notes);
};
exports.getAllNotes = getAllNotes;
// About the Website 
const getAbout = (req, res) => {
    res.send("This is a Notes API Backend");
};
exports.getAbout = getAbout;
// GET NOTE BY ID
const getNoteById = async (req, res) => {
    const id = Number(req.params.id);
    const userId = req.user.id;
    const note = await prisma_js_1.default.note.findFirst({
        where: {
            id,
            userId,
        },
    });
    if (!note) {
        return res.status(404).json({
            message: "Note not found",
        });
    }
    res.status(200).json(note);
};
exports.getNoteById = getNoteById;
// USER
const getUserName = (req, res) => {
    const name = req.params.name;
    res.send(`Welcome ${name}`);
};
exports.getUserName = getUserName;
// SEARCH
const searchNote = (req, res) => {
    const title = req.query.title;
    res.send(`Searching for: ${title}`);
};
exports.searchNote = searchNote;
// CREATE NOTE
const createNote = async (req, res) => {
    const { title } = req.body;
    const userId = req.user.id;
    const newNote = await prisma_js_1.default.note.create({
        data: {
            title,
            userId,
        },
    });
    res.status(201).json({
        message: "Note created successfully",
        note: newNote,
    });
};
exports.createNote = createNote;
// UPDATE NOTE
const updateNote = async (req, res) => {
    const id = Number(req.params.id);
    const { title } = req.body;
    const userId = req.user.id;
    const existingNote = await prisma_js_1.default.note.findFirst({
        where: {
            id,
            userId,
        },
    });
    if (!existingNote) {
        return res.status(403).json({
            message: "You are note eligible to authorise and change this note ",
        });
    }
    const updatedNote = await prisma_js_1.default.note.update({
        where: {
            id,
        },
        data: {
            title,
        },
    });
    res.status(200).json({
        message: "Note updated successfully",
        note: updatedNote,
    });
};
exports.updateNote = updateNote;
// DELETE NOTE
const deleteNote = async (req, res) => {
    const id = Number(req.params.id);
    const userId = req.user.id;
    const existingNote = await prisma_js_1.default.note.findFirst({
        where: {
            id,
            userId,
        },
    });
    if (!existingNote) {
        return res.status(403).json({
            message: "You are not eligible to authorise or chaneg the note",
        });
    }
    const deletedNote = await prisma_js_1.default.note.delete({
        where: {
            id,
        },
    });
    res.status(200).json({
        message: "Note deleted successfully",
        note: deletedNote,
    });
};
exports.deleteNote = deleteNote;
