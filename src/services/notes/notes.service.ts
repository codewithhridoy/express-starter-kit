import { Request, Response } from 'express'
import NotesModel from 'models/notes/notes.model'
import { CreateNoteInput } from 'schemas/notes/notes.schema'

export const createNote = async (req: Request<any, any, CreateNoteInput>, res: Response) => {
  try {
    const { title, content, category, published } = req.body

    const note = await NotesModel.create({
      title,
      content,
      category,
      published,
    })

    res.status(201).json({
      status: 'success',
      data: {
        note,
      },
    })
  } catch (error: any) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        status: 'failed',
        message: 'Note with that title already exists',
      })
    }

    res.status(500).json({
      status: 'error',
      message: error.message,
    })
  }
}
