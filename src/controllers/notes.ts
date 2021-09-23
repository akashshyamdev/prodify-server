import { Request, Response } from 'express';
import path from 'path';
import cloudinary from '../config/cloudinary';
import Note from '../models/Note';

export async function createNote(req: Request, res: Response) {
  try {
    // @ts-ignore
    const { user, body } = req;

    const { url } = await cloudinary.uploader.upload(`${path.resolve(__dirname, '../../uploads/dummy.mp4')}`, {
      resource_type: 'auto',
    });

    const note = await Note.create({ ...body, developer: user.id, audioUrl: url });

    res.status(201).json({ data: note });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}

export async function getAllNotes(req: Request, res: Response) {
  try {
    // @ts-ignore
    const { user } = req;

    const notes = await Note.find({ developer: user.id });

    res.status(201).json(notes);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}
