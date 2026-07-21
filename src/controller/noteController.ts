import type { Request, Response } from "express";
import type { AuthRequest } from "../types/express.js";
import prisma from "../lib/prisma.js";

// GET ALL NOTES (Only Logged-in User's Note)
export const getAllNotes = async (req: AuthRequest,res: Response) => {
  const userId = req.user!.id;
  const notes = await prisma.note.findMany({
    where: {
      userId,
    },
  });
  res.status(200).json(notes);
};

// About the Website 
export const getAbout = (req: Request, res: Response) => {
  res.send("This is a Notes API Backend");
};

// GET NOTE BY ID
export const getNoteById = async (
  req: AuthRequest,
  res: Response
) => {
  const id = Number(req.params.id);
  const userId = req.user!.id;

  const note = await prisma.note.findFirst({
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

// USER
export const getUserName = (req: Request, res: Response) => {
  const name = req.params.name;

  res.send(`Welcome ${name}`);
};

// SEARCH
export const searchNote = (req: Request, res: Response) => {
  const title = req.query.title;

  res.send(`Searching for: ${title}`);
};

// CREATE NOTE
export const createNote = async (
  req: AuthRequest,
  res: Response
) => {
  const { title } = req.body;

  const userId = req.user!.id;

  const newNote = await prisma.note.create({
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

// UPDATE NOTE
export const updateNote = async (
  req: AuthRequest,
  res: Response
) => {
  const id = Number(req.params.id);
  const { title } = req.body;
  const userId = req.user!.id;

  const existingNote = await prisma.note.findFirst({
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

  const updatedNote = await prisma.note.update({
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

// DELETE NOTE
export const deleteNote = async (
  req: AuthRequest,
  res: Response
) => {
  const id = Number(req.params.id);
  const userId = req.user!.id;

  const existingNote = await prisma.note.findFirst({
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

  const deletedNote = await prisma.note.delete({
    where: {
      id,
    },
  });

  res.status(200).json({
    message: "Note deleted successfully",
    note: deletedNote,
  });
};