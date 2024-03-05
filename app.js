const express = require('express')
const ejs = require('ejs')
const multer  = require('multer')
const { MongoClient } = require('mongodb')

const app = express();
const port = 10000;

// Set up multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/doctorp/images/doctors/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
    }
});

const upload = multer({ storage: storage });


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

        const ddas = await collection.find().toArray();
        res.render('./doctor/doctor-dashboard', { ddas });
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
// Updated route for adding doctors with image upload
app.post('/adoc', upload.single('dimg'), async (req, res) => {
    try {
        await client.connect();
        const db = client.db('hospital');
        const collection = db.collection('doctors');

        const { dname, dusername, dpassword, ddepartment, daddress, demail, dbloodgroup, dphone, dtiming, dsex} = req.body;

                // Save the filename in the database
                const dimg = req.file.filename;

        const myobj = { dname, dusername, dpassword, ddepartment, daddress, demail, dbloodgroup, dphone, dtiming, dsex, dimg };
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
app.get('/uapp', async (req, res) => {
    try {
        await client.connect();
        const db = client.db('hospital');
        const collection = db.collection('doctors');

        const udo = await collection.find().toArray();
        res.render('./user/appointment', { udo });
    } finally {
        await client.close();
    }
});
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

// new
app.post('/dapp', async (req, res) => {
    try {
        await client.connect();
        const db = client.db('hospital');
        const collection = db.collection('patients');

        const { pproblem, pdescription } = req.body;

        const myobj = { pproblem, pdescription };
        await collection.updateOne(myobj);

        console.log("1 document inserted");
        res.redirect('/dapp'); // Redirect after successful insertion
    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.close();
    }
});

// -new 


// route

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});