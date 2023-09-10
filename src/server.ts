require('dotenv').config()
import express, { Request, Response } from 'express'
import morgan from 'morgan'
import cors from 'cors'
import { connectDB, sequelize } from 'configs/database/db'
import router from 'routes/notes/notes.route'

const app = express()

app.use(express.json({ limit: '10kb' }))
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))

app.use(
  cors({
    origin: ['http://localhost:3000'],
    credentials: true,
  })
)

app.get('/api/health-checker', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Build CRUD API with Node.js and Sequelize',
  })
})

app.use('/api/notes', router)

app.all('*', (req: Request, res: Response) => {
  res.status(404).json({
    status: 'fail',
    message: `Route: ${req.originalUrl} does not exist on this server`,
  })
})

const PORT = process.env.PORT || 8000
app.listen(PORT, async () => {
  console.log('🚀Server started Successfully')
  await connectDB()
  sequelize.sync({ force: false }).then(() => {
    console.log('✅Synced database successfully...')
  })
})
