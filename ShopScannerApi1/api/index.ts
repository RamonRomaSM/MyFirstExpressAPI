import { db } from '@vercel/postgres';
import { kv } from '@vercel/kv';
import Express from 'express';
import http from 'http';
const express = require("express");
const app = express();



app.get("/", async function(req, res) {
    res.send("Respuesta por defecto");
});

app.get("/getPagina/:num/:hint", async function( req,res ) {
 
    let num = req.params.num * 30;
    let hint;
    if(req.params.hint == "Escribe lo que quieras buscar"){hint ='%';}
    else{hint ='% ' + req.params.hint + ' %';}
    const client = await db.connect();
   
    const a = await client.sql`SELECT * FROM productos WHERE LOWER(nombre) LIKE LOWER(${hint}) LIMIT 30 OFFSET ${num};`;
    const resp = a["rows"];//para deshacerse de lo innnecesario
    res.status(200).json({resp});
});

app.get("/register/nombre/:nombre/passw/:passw",async function (req,res) {

    const client = await db.connect();
    const a = await client.sql`SELECT existe_usuario(${req.params.nombre});`;

    const existe = a["rows"][0]["existe_usuario"]
    

    if(existe == false){
        client.sql`INSERT INTO usuarios (nombre, passw) VALUES (${req.params.nombre}, ${req.params.passw});`
        res.status(200).send("resp:"+true);
    }
    else{
        res.status(200).send("resp:"+false);
    }
});

app.get("/login/nombre/:nombre/passw/:passw",async function(req,res) {
    const client = await db.connect();
    const exists = await client.sql`SELECT * FROM usuarios WHERE nombre = ${req.params.nombre} AND passw = ${req.params.passw};`;
   //tengo que darte tu usuario + listas
    res.status(200).json({exists});
});




app.listen(3000, () => console.log("Server ready on port 3000."));

module.exports = app;
