const express = require("express")
const db = require("../../db")
const students = require("../../../students.json")

const router = express.Router()

router.post("/", async (req, res) => {

    const response = await db.query(`INSERT INTO "students" (id, name, surname, email, dateofbirth) 
    Values ($1, $2, $3, $4, $5)`,
        [req.body.id, req.body.name, req.body.surname, req.body.email, req.body.dateofbirth])


    res.send(response.row)
})

router.get("/", async (req, res) => {

    const order = req.query.order || "desc"
    const offset = req.query.offset || 0
    const limit = req.query.limit || 10


    delete req.query.order
    delete req.query.offset
    delete req.query.limit

    let query = 'SELECT * FROM "students" '

    const params = []
    for (queryParam in req.query) { //for each value in query string, I'll filter
        params.push(req.query[queryParam])

        if (params.length === 1) // for the first, I'll add the where clause
            query += `WHERE ${queryParam} = $${params.length} `
        else // the all the rest, it'll start with AND
            query += ` AND ${queryParam} = $${params.length} `
    }

    query += " ORDER BY id " + order  //adding the sorting 

    params.push(limit)
    query += ` LIMIT $${params.length} `
    params.push(offset)
    query += ` OFFSET $${params.length}`
    console.log(query)


    const response = await db.query(query, params)
    res.send(response.rows)
})

router.get("/:id", async (req, res) => {
    const response = await db.query('SELECT * FROM students WHERE id = $1',
        [req.params.id])

    if (response.rowCount === 0)
        return res.status(404).send("Not found")

    res.send(response.rows[0])
})

router.post("/", async (req, res) => {
    const response = await db.query(`INSERT INTO "students" (id, name, surname, email, dateofbirth) 
                                     Values ($1, $2, $3, $4, $5)
                                     RETURNING *`,
        [req.body.id, req.body.name, req.body.surname, req.body.email, req.body.dateofbirth])

    console.log(response)
    res.send(response.rows[0])
})

router.put("/:id", async (req, res) => {
    try {
        let params = []
        let query = 'UPDATE "students" SET '
        for (bodyParamName in req.body) {
            query +=
                (params.length > 0 ? ", " : '') +
                bodyParamName + " = $" + (params.length + 1)

            params.push(req.body[bodyParamName])
        }

        params.push(req.params.id)
        query += " WHERE id = $" + (params.length) + " RETURNING *"
        console.log(query)

        const result = await db.query(query, params)

        if (result.rowCount === 0)
            return res.status(404).send("Not Found")

        res.send(result.rows[0])
    }
    catch (ex) {
        console.log(ex)
        res.status(500).send(ex)
    }
})

router.delete("/:id", async (req, res) => {
    const response = await db.query(`DELETE FROM "students" WHERE id = $1`, [req.params.id])

    if (response.rowCount === 0)
        return res.status(404).send("Not Found")

    res.send("OK")
})

//EVERYTHING IS OK GET, GETID, POST, PUT, DELETE AND IN POSTMAN I ADDED THE CHECK EMAIL TO AVOID DUPLICATED EMAIL

module.exports = router