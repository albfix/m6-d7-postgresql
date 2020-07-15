const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
dotenv.config()
const db = require("./db")
const studentRouter = require("./routes/students")
const { response } = require("express")

const server = express()
server.use(cors())
server.use(express.json())

server.get("/", (req, res) => {
    res.send("The server is running!")
})

server.get("/test", async (req, res) => {
    const response = await db.query('SELECT ID, name, surname, email, dateOfBirth FROM "Students"')
    res.send(response.rows)
})

server.use("/students", studentRouter)

server.listen(process.env.PORT || 3456, () => console.log("Running on ", process.env.PORT || 3457))