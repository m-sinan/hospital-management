const express = require('express');
const ejs = require('ejs');
const { MongoClient } = require('mongodb');

const app = express();
const port = 5000;


app.set('view engine','ejs');
app.use(express.static('public'));

const useRoutes = require('./routes/userRoutes');
const docRoutes = require('./routes/doctorRoutes');
const admRoutes = require('./routes/adminRoutes');

app.use('/',useRoutes);
app.use('/doc',docRoutes);
app.use('/adm',admRoutes);


const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);


app.get('/dpat', async (req, res) => {
  try {
      await client.connect();
      const db = client.db('hospital');
      const collection = db.collection('patients');

      const dpat = await collection.find().toArray();
      res.render('./doctor/doctor-Patients', { dpat });
  } finally {
      await client.close();
  }
});
app.get('/ddas', async (req, res) => {
  try {
      await client.connect();
      const db = client.db('hospital');
      const collection = db.collection('patients');

      const dpat = await collection.find().toArray();
      res.render('./doctor/doctor-dashboard', { dpat });
  } finally {
      await client.close();
  }
});
app.get('/udoc', async (req, res) => {
  try {
      await client.connect();
      const db = client.db('hospital');
      const collection = db.collection('doctors');

      const udo = await collection.find().toArray();
      res.render('./user/doctors', { udo });
  } finally {
      await client.close();
  }
});
app.get('/ublo', async (req, res) => {
  try {
      await client.connect();
      const db = client.db('hospital');
      const collection = db.collection('blog');

      const ublo = await collection.find().toArray();
      res.render('./user/blog', { ublo });
  } finally {
      await client.close();
  }
});
app.get('/', async (req, res) => {
  try {
      await client.connect();
      const db = client.db('hospital');
      const collection = db.collection('blog');

      const ublo = await collection.find().toArray();
      res.render('./user/index', { ublo });
  } finally {
      await client.close();
  }
});
app.get('/apas', async (req, res) => {
  try {
      await client.connect();
      const db = client.db('hospital');
      const collection = db.collection('patients');

      const apat = await collection.find().toArray();
      res.render('./admin/admin-Patients', { apat });
  } finally {
      await client.close();
  }
});
app.get('/adoc', async (req, res) => {
  try {
      await client.connect();
      const db = client.db('hospital');
      const collection = db.collection('doctors');

      const ado = await collection.find().toArray();
      res.render('./admin/admin-doctors', { ado });
  } finally {
      await client.close();
  }
});
app.get('/asta', async (req, res) => {
  try {
      await client.connect();
      const db = client.db('hospital');
      const collection = db.collection('staffs');

      const ast = await collection.find().toArray();
      res.render('./admin/admin-staffs', { ast });
  } finally {
      await client.close();
  }
});
// route

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});