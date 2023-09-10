import express from 'express'
import {
  createNoteController,
  deleteNoteController,
  findAllNotesController,
  findNoteController,
  updateNoteController,
} from 'controllers/notes/notes.controller'
import { validate } from 'middlewares/validate'
import { createNoteSchema, updateNoteSchema } from 'schemas/notes/notes.schema'

const router = express.Router()

router.route('/').get(findAllNotesController).post(validate(createNoteSchema), createNoteController)
router
  .route('/:noteId')
  .get(findNoteController)
  .patch(validate(updateNoteSchema), updateNoteController)
  .delete(deleteNoteController)

export default router
