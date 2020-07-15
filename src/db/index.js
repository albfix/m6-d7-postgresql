const { Pool } = require("pg")

const pool = new Pool() //LEGGE .ENV E COLLEGA AL DB


module.exports = {

    query: (text, params) => pool.query(text, params)
}