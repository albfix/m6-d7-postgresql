const express = require("express")
const db = require("../../db")
const projects = require("../../../projects.json")

const router = express.Router()



router.get("/:Id", async (req, res) => {
    const response = await db.query(`SELECT * FROM "projects" JOIN "students" 
     on projects.id = students.id`,
        [req.params.id])

    if (response.rowCount === 0)
        return res.status(404).send("Not found")

    res.send(response.rows[0])
})






module.exports = router