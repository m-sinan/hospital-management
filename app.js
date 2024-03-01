const express = require('express');
const ejs = require('ejs');
const { MongoClient } = require('mongodb');

const app = express();
const port = 10000;

// new
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
// new

app.set('view engine', 'ejs');
app.use(express.static('public'));

const useRoutes = require('./routes/userRoutes');
const docRoutes = require('./routes/doctorRoutes');
const admRoutes = require('./routes/adminRoutes');

app.use('/', useRoutes);
app.use('/doc', docRoutes);
app.use('/adm', admRoutes);


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

//new

app.post('/', async (req, res) => {
    try {
        await client.connect();
        const db = client.db('hospital');
        const collection = db.collection('patients');

        const { pname, page, psex, pplace, pdepartment, pdoctor, pbloodgroup, pphone, pdate } = req.body;

        const myobj = { pname, page, psex, pplace, pdepartment, pdoctor, pbloodgroup, pphone, pdate };
        await collection.insertOne(myobj);

        console.log("1 document inserted");
        res.redirect('/'); // Redirect after successful insertion
    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.close();
    }
});

// new

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

// new

app.post('/adoc', async (req, res) => {
    try {
        await client.connect();
        const db = client.db('hospital');
        const collection = db.collection('doctors');

        const { dname, dusername, dpassword, ddepartment, daddress, demail, dbloodgroup, dphone, dtiming, dsex} = req.body;

        const myobj = { dname, dusername, dpassword, ddepartment, daddress, demail, dbloodgroup, dphone, dtiming, dsex };
        await collection.insertOne(myobj);

        console.log("1 document inserted");
        res.redirect('/adoc'); // Redirect after successful insertion
    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.close();
    }
});

// -new
  
// new
app.post('/uapp', async (req, res) => {
    try {
        await client.connect();
        const db = client.db('hospital');
        const collection = db.collection('patients');

        const { pname, page, psex, pplace, pdepartment, pdoctor, pbloodgroup, pphone, pdate, pemail } = req.body;

        const myobj = { pname, page, psex, pplace, pdepartment, pdoctor, pbloodgroup, pphone, pdate, pemail };
        await collection.insertOne(myobj);

        console.log("1 document inserted");
        res.redirect('/uapp'); // Redirect after successful insertion
    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.close();
    }
});

// -new 

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
app.get('/dblo', async (req, res) => {
    try {
        await client.connect();
        const db = client.db('hospital');
        const collection = db.collection('blog');

        const dblo = await collection.find().toArray();
        res.render('./doctor/doctor-Blog', { dblo });
    } finally {
        await client.close();
    }
});

//new 

app.post('/dblo', async (req, res) => {
    try {
        await client.connect();
        const db = client.db('hospital');
        const collection = db.collection('blog');

        const { btitle, bimage, bdescription, bdate } = req.body;

        const myobj = { btitle, bimage, bdescription, bdate };
        await collection.insertOne(myobj);

        console.log("1 document inserted");
        res.redirect('/dblo'); // Redirect after successful insertion
    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.close();
    }
});

// -new

app.get('/dapp', async (req, res) => {
    try {
        await client.connect();
        const db = client.db('hospital');
        const collection = db.collection('patients');

        const dapp = await collection.find().toArray();
        res.render('./doctor/doctor-Appointments', { dapp });
    } finally {
        await client.close();
    }
});


app.get('/acon', async (req, res) => {
    try {
        await client.connect();
        const db = client.db('hospital');
        const collection = db.collection('message');

        const acont = await collection.find().toArray();
        res.render('./doctor/contactus', { acont });
    } finally {
        await client.close();
    }
});

// route

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});