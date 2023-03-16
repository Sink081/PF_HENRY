const Clients = require('../models/Clients');
const Order = require('../models/Order')
const sendMail = require('../Helpers/email')
const sendMailWelcome = require('../Helpers/emailRegisterClient')
const sendMailOrder = require('../Helpers/emailCreateOrder')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const TOKEN_KEY = "17318cd9-78c9-49ab-b6bd-9f6ca4ebc818";



// PUTS

// DELETES




const registerClient = async (client) => { //FUNCIONANDO

  const { password } = client
  try {
    const clientBDD = await Clients.find({ email: client.email }, { password: 0 })

    if (!clientBDD.length) {
      const newClient = new Clients(client);
      const salt = bcrypt.genSaltSync(10);
      newClient.password = bcrypt.hashSync(password, salt)
      await newClient.save();
      await sendMail(newClient.email,token);
      const clientBDD = await Clients.find({ email: client.email }, { password: 0 })
      const dataClient = clientBDD[0]
      return dataClient
    }
    const dataClient = clientBDD[0]
    return dataClient

  } catch (error) {
    return error.message
  }



  //return true;
}

const searchClientExist = async (email) => { // FUNCIONANDO
  try {
    const findClient = await Clients.find({ email: email });
    if (findClient.length) return true
    return false
  } catch (error) {
    return error.message
  }
}

const searchClientById = async (id) => { // FUNCIONANDO
  try {
    const client = Clients.findById(id, {password:0})
    return client
  } catch (error) {
    return error.message
  }
}

const searchClient = async (email) => { // FUNCIONANDO
  try {
    const clientBDD = await Clients.find({ email: email }, { password: 0 })
    return clientBDD[0]
  } catch (error) {
    return error.message
  }
}
const validatePasswordClient = async (email, password) => { // FUNCIONANDO
  try {
    const findClient = await Clients.find({ email: email });
    const client = findClient[0];

    // VALIDAR CONTRASEÑA
    const pass = bcrypt.compareSync(password, client.password);

    if (pass) return true
    return false

  } catch (error) {
    return error.message
  }
}

const updateClient = async (clientId, body) => {
  try {
    const client = Clients.findByIdAndUpdate(clientId, body, { new: true })
    return client;
  } catch (error) {
    return false
  }
}

const confirmEmail = async (token ) => { // FUNCIONANDO
  try {
    const payload = jwt.verify(token,TOKEN_KEY)
    
    let email = payload.email;
    
    const client = await Clients.findOne({email});
    
    if (!client) return "No se encontro el usuario"
    if (client.emailVerified) return "El correo ya se encuentra registrado"
    
    client.emailVerified = true;
    await client.save()
    await sendMailWelcome(client.email,client.firstname,client.lastname);
    return "El correo electronico ha sido verificado"

  } catch (error) {
    return "Token invalido";
  }
}


module.exports = {
  searchClientById,
  registerClient,
  searchClientExist,
  validatePasswordClient,
  searchClient, 
  updateClient,
  confirmEmail
}