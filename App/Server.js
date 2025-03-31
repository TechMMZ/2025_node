// importar el modulo express(permite crear un servidor)
const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const app = express(); //contiene el servidor express

//configuracion de la conexion
const db = mysql.createConnection({
    //creamos variables globales
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'bdsistema'
});

// establecer una conexion directa(punto de conexion)
db.connect((err) => {
    if (err) {
        console.error('Error de conexion en la BD......');
        return;
    }
    console.log('Conexion Exitosa.....');
});

// habilitar la plantilla de EJS
// view engine: motor de vistas
// urlencode: caracteristicas especiales
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

//AgregarUsuario
app.post('/crear', (req, res) => {
    //nombre , email campos que provioene del formulario
    const { nombres, email } = req.body;
    db.query('INSERT INTO users (nombres, email) VALUES (?, ?)', [nombres, email], (err, results) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// Editar usuario por id
app.post('/editar/:id', (req, res) => {
    const { id } = req.params;
    const { nombres, email } = req.body;
    // Aquí actualizas en tu base de datos
    db.query('UPDATE users SET nombres = ?, email = ? WHERE id = ?', [nombres, email, id], (err) => {
        if (err) throw err;
        res.redirect('/');
    });
});


// Eliminar usuario por id
app.get('/eliminar/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM users WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('❌ Error al eliminar usuario:', err);
            return res.status(500).send("Error en el servidor.");
        }
        res.redirect('/');
    });
});


// Listar los usuarios
app.get('/', (req, res) => {
    db.query("SELECT * FROM users", (err, results) => {
        if (err) throw err;
        res.render('index', { usuarios: results });
    })
});

// Ruta para servir el favicon
app.use('/favicon.ico', express.static(path.join(__dirname, '..', 'favicon.ico')));

// habilitamos servidor
// listen para habilitado el servidor
app.listen(8000, () => {
    console.log('Servidor Express corriendo en http://localhost:8000')
});