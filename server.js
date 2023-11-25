require('dotenv').config()
console.log(process.env)



// Recuperation de la resource http de Node
const http = require ('http');


// Recuperation de lappli app
const app = require('./app');


// On set le port a la valeur du port
app.set('port', process.env.PORT || 3000);


// Creation dun serveur http Node
const server=http.createServer(app);


// Mise sous ecoute du serveur sur port proposé ou 3000
server.listen(process.env.PORT || 3000);