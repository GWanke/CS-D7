const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient
const uri = "mongodb+srv://Wanke:98e30ffe@cluster0-y0yxh.gcp.mongodb.net/test?retryWrites=true&w=majority"
var ObjectId = require('mongodb').ObjectID;
// inicializar app express
const app = express();

let porta = 8000;



app.use(bodyParser.urlencoded({ extended: true }))


MongoClient.connect(uri, (err, client) => {
  if (err) return console.log(err)
  db = client.db('test') // coloque o nome do seu DB

  app.listen(porta, () => {
    console.log('Servidor criado com sucesso na porta: ' +porta)
  })
})

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.render('home.ejs')
})
app.get('/', (req, res) => {
  let cursor = db.collection('Autores').find()
})
app.get('/', (req, res) => {
  let cursor = db.collection('Funcionarios').find()
})
app.get('/show', (req, res) => {
    db.collection('Autores').find().toArray((err, results) => {
        if (err) return console.log(err)
        res.render('show.ejs', { Autores: results })
    })
})
app.get('/showF', (req, res) => {
    db.collection('Funcionarios').find().toArray((err, results) => {
        if (err) return console.log(err)
        res.render('showF.ejs', { Funcionarios: results })
    })
})
app.post('/show', (req, res) => {
  db.collection('Autores').insertOne(req.body,(err,result) =>{
    if (err) return console.log(err)
    console.log('Salvo no DB!')
    res.redirect('/show')
  })
})
app.post('/showF', (req, res) => {
  db.collection('Funcionarios').createIndex({"CPF": 1}, { unique: true } )
  db.collection('Funcionarios').insertOne(req.body,(err,result) =>{
    if (err) return console.log(err)
    console.log('Salvo no DB!')
    res.redirect('/showF')
  })
})
app.route('/view')
.get((req,res)=>{
  res.render('view.ejs')
})
app.route('/viewF')
.get((req,res)=>{
  res.render('viewF.ejs')
})
app.route('/edit/:id')
.get((req, res) => {
  var id = req.params.id
  db.collection('Autores').find(ObjectId(id)).toArray((err, result) => {
    if (err) return res.send(err)
    res.render('edit.ejs', { Autores: result })
  })
})
.post((req, res) => {
  var id = req.params.id
  var name = req.body.name
  var surname = req.body.surname
  var date = req.body.date
  db.collection('Autores').updateOne({_id: ObjectId(id)}, {
    $set: {
      name: name,
      surname: surname,
      date: date
    }
  }, (err, result) => {
    if (err) return res.send(err)
    res.redirect('/show')
    console.log('Atualizado no Banco de Dados')
  })
})
app.route('/editF/:id')
.get((req, res) => {
  var id = req.params.id
  db.collection('Funcionarios').find(ObjectId(id)).toArray((err, result) => {
    if (err) return res.send(err)
    res.render('editF.ejs', { Funcionarios: result })
  })
})
.post((req, res) => {
  var id = req.params.id
  var CPF = req.body.CPF
  var name = req.body.name
  var surname = req.body.surname
  var date = req.body.date
  db.collection('Funcionarios').updateOne({_id: ObjectId(id)}, {
    $set: {
      CPF: CPF,
      name: name,
      surname: surname,
      date: date
    }
  }, (err, result) => {
    if (err) return res.send(err)
    res.redirect('/showF')
    console.log('Atualizado no Banco de Dados')
  })
})

app.route('/delete/:id')
.get((req, res) => {
  var id = req.params.id

  db.collection('Autores').deleteOne({_id: ObjectId(id)}, (err, result) => {
    if (err) return res.send(500, err)
    console.log('Deletado do Banco de Dados!')
    res.redirect('/show')
  })
})
app.route('/deleteF/:id')
.get((req, res) => {
  var id = req.params.id

  db.collection('Funcionarios').deleteOne({_id: ObjectId(id)}, (err, result) => {
    if (err) return res.send(500, err)
    console.log('Deletado do Banco de Dados!')
    res.redirect('/showF')
  })
})