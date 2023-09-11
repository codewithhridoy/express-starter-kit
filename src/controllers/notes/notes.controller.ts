import { Request, Response } from 'express'
import NotesModel from 'models/notes/notes.model'
import { CreateNoteInput, FilterQueryInput, ParamsInput, UpdateNoteInput } from 'schemas/notes/notes.schema'

export const createNoteController = async (req: Request<any, any, CreateNoteInput>, res: Response) => {
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

export const updateNoteController = async (
  req: Request<UpdateNoteInput['params'], {}, UpdateNoteInput['body']>,
  res: Response
) => {
  try {
    const result = await NotesModel.update(
      { ...req.body, updatedAt: Date.now() },
      {
        where: {
          id: req.params.noteId,
        },
      }
    )

    if (result[0] === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'Note with that ID not found',
      })
    }

    const note = await NotesModel.findByPk(req.params.noteId)

    res.status(200).json({
      status: 'success',
      data: {
        note,
      },
    })
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    })
  }
}

export const findNoteController = async (req: Request<ParamsInput>, res: Response) => {
  try {
    const note = await NotesModel.findByPk(req.params.noteId)

    if (!note) {
      return res.status(404).json({
        status: 'fail',
        message: 'Note with that ID not found',
      })
    }

    res.status(200).json({
      status: 'success',
      data: {
        note,
      },
    })
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    })
  }
}

export const findAllNotesController = async (req: Request<{}, {}, {}, FilterQueryInput>, res: Response) => {
  try {
    const page = req.query.page || 1
    const limit = req.query.limit || 10
    const skip = (page - 1) * limit

    const notes = await NotesModel.findAll({
      limit,
      offset: skip,
      order: [['createdAt', 'DESC']],
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    })

    res.status(200).json({
      status: 'success',
      results: notes.length,
      notes,
    })
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    })
  }
}

export const deleteNoteController = async (req: Request<ParamsInput>, res: Response) => {
  try {
    const result = await NotesModel.destroy({
      where: { id: req.params.noteId },
      force: true,
    })

    if (result === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'Note with that ID not found',
      })
    }

    res.status(204).json()
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    })
  }
}
