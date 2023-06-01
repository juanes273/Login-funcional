const express = require('express');
const app = express();
const port = 5000;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');

// Conectamos a la base de datos de MongoDB
const uri = "mongodb+srv://brandjuan:nDV1dZYmQCH7bbq4@civilizacion-china.p8tyooj.mongodb.net/CivilizacionesDB";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.log(err));

// Configuramos los middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Definimos el modelo de usuario
const User = mongoose.model('User', {
  email: String,
  password: String,
});

// Ruta de registro de usuario
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verificamos si el usuario ya existe en la base de datos
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Hash de la contraseña antes de almacenarla
    const hashedPassword = await bcrypt.hash(password, 10);

    // Creamos un nuevo usuario
    const user = new User({ email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'Registro exitoso' });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Ruta de inicio de sesión
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscamos al usuario por su correo electrónico
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Credenciales inválidas (No user)' });
    }

    // Comparamos la contraseña ingresada con la almacenada en la base de datos
    if (password !== user.password) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    res.json({ message: 'Inicio de sesión exitoso' });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));

//prueba
