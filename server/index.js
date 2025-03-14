// Comando para iniciar servidor con nodemon: npm run server

const express = require("express")
const app = express()

app.listen(3000, () => {
    console.log("App running")
})