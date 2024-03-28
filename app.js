const express = require('express')
const ejs = require('ejs')
const fs = require('fs')
const multer = require('multer')
const { MongoClient, ObjectId } = require('mongodb')

const app = express();
const port = 8000;  

// Set up multer for file upload
const storagea = multer.diskStorage({
    destination: function (req, file, ca,) {
        ca(null, 'public/adminp/image/doctors/');

    },
    filename: function (req, file, ca) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        ca(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
    }
});

const uploada = multer({ storage: storagea });

// Set up multer for file upload
const storageb = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/adminp/image/staff/')

    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
    }
});

const uploadb = multer({ storage: storageb });

// Set up multer for file upload
const storagec = multer.diskStorage({
    destination: function (req, file, cc) {
        cc(null, 'public/doctorp/images/blog/');

    },
    filename: function (req, file, cc) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cc(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
    }
});

const uploadc = multer({ storage: storagec });


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

app.get('/apat', async (req, res) => {
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
app.post('/adoc', uploada.single('dimg'), async (req, res) => {
    try {
        await client.connect();
        const db = client.db('hospital');
        const collection = db.collection('doctors');

        const { dname, dusername, dpassword, ddepartment, daddress, demail, dbloodgroup, dphone, dtiming, dsex } = req.body;

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


// Define the route to handle the deletion of a doctor record
app.post('/deletedoc', async (req, res) => {
    try {
        // Get the doctorId from the form data
        const doctorId = req.body.doctorId;

        // Connect to the MongoDB database
        const client = await MongoClient.connect('mongodb://localhost:27017/');
        
        const db = client.db('hospital');
        const collection = db.collection('doctors');

        const doctor = await collection.findOne({ _id: new ObjectId(doctorId) });


        // Delete the doctor record with the specified doctorId
        const result = await collection.deleteOne({ _id: new ObjectId(doctorId) });

        if (result.deletedCount === 1) {
            console.log(`Doctor with ID ${doctorId} deleted successfully.`);
            fs.unlinkSync('public/adminp/image/doctors/' + doctor.dimg);
            console.log('image deleted successfullly')
        } else {
            console.log(`Doctor with ID ${doctorId} not found.`);
        }

        // Redirect after successful deletion
        return res.redirect('/adoc');
    } catch (e) {
        console.error(`Error: ${e}`);
        return "An error occurred while deleting the doctor record.";
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

// Define the route to handle the deletion of a staff record
app.post('/deletesta', async (req, res) => {
    try {
        // Get the staff from the form data
        const staffId = req.body.staffId;

        // Connect to the MongoDB database
        const client = await MongoClient.connect('mongodb://localhost:27017/');
        const db = client.db('hospital');
        const collection = db.collection('staffs');

        const staff = await collection.findOne({ _id: new ObjectId(staffId) });

        // Delete the staff record with the specified staff
        const result = await collection.deleteOne({ _id: new ObjectId(staffId) });

        if (result.deletedCount === 1) {
            console.log(`staff with ID ${staffId} deleted successfully.`);
            fs.unlinkSync('public/adminp/image/staff/'+staff.simg);
            console.log('image deleted successfullly')
        } else {
            console.log(`staff with ID ${staffId} not found.`);
        }

        // Redirect after successful deletion
        return res.redirect('/asta');
    } catch (e) {
        console.error(`Error: ${e}`);
        return "An error occurred while deleting the staff record.";
    }
});


// Updated route for adding doctors with image upload
app.post('/asta', uploadb.single('simg'), async (req, res) => {
    try {
        await client.connect();
        const db = client.db('hospital');
        const collection = db.collection('staffs');

        const { sname, sdepartment, saddress, semail, sbloodgroup, sphone, stiming, ssex } = req.body;

        // Save the filename in the database
        const simg = req.file.filename;

        const myobj = { sname, sdepartment, saddress, semail, sbloodgroup, sphone, stiming, ssex, simg };
        await collection.insertOne(myobj);


        console.log("1 document inserted");
        res.redirect('/asta'); // Redirect after successful insertion
    } catch (err) {
        console.error("Error:", err);
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

app.post('/dblo', uploadc.single('bimage'), async (req, res) => {
    try {
        await client.connect();
        const db = client.db('hospital');
        const collection = db.collection('blog');

        const { btitle, bdescription, bdate } = req.body;

        // Save the filename in the database
        const bimage = req.file.filename;

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

// Define the route to handle the deletion of a doctor record
app.post('/deleteblo', async (req, res) => {
    try {
        // Get the doctorId from the form data
        const blogId = req.body.blogId;

        // Connect to the MongoDB database
        const client = await MongoClient.connect('mongodb://localhost:27017/');
        
        const db = client.db('hospital');
        const collection = db.collection('blog');

        const blog = await collection.findOne({ _id: new ObjectId(blogId) });


        // Delete the blog record with the specified blogid
        const result = await collection.deleteOne({ _id: new ObjectId(blogId) });

        if (result.deletedCount === 1) {
            console.log(`blog with ID ${blogId} deleted successfully.`);
            fs.unlinkSync('public/doctorp/images/blog/' + blog.bimage);
            console.log('image deleted successfullly')
        } else {
            console.log(`Doctor with ID ${blogId} not found.`);
        }

        // Redirect after successful deletion
        return res.redirect('/dblo');
    } catch (e) {
        console.error(`Error: ${e}`);
        return "An error occurred while deleting the doctor record.";
    }
});

// -new

app.get('/dapp', async (req, res) => {
    try {
        await client.connect();
        const db = client.db('hospital');
        const collection = db.collection('patients');

        const {pproblem} = req.body;
        const dapp = await collection.find().sort({ _id: -1 }).toArray();
        res.render('./doctor/doctor-Appointments', { dapp, pproblem});
    } finally {
        await client.close();
    }
});

// new

app.post('/updateapp', async (req, res) => {
    try {
        // Connect to the MongoDB database
        const client = await MongoClient.connect('mongodb://localhost:27017/');
        const db = client.db('hospital');
        const collection = db.collection('patients');

        const { patientId, pproblem, pdescription, pmorning, mafterfood, pafternoon, aafterfood,  pnight, nafterfood } = req.body;


        console.log(patientId);
        // Update the patient record with the specified patientId
        const result = await collection.updateOne({ _id: new ObjectId(patientId) }, { $set: { pproblem, pdescription, pmorning, mafterfood, pafternoon, aafterfood,  pnight, nafterfood} });

        // Check if the patient record was updated successfully
        if (result.modifiedCount === 1) {
            console.log(`patient with ID ${patientId} updated successfully.`);
            return res.redirect('/dapp');
        } else {
            console.log(`patient with ID ${patientId} not found.`);
        }

        // Redirect after successful deletion
    } catch (e) {
        console.error(`Error: ${e}`);
        return "An error occurred while updating the patient record.";
    }
});

// -new 

app.post('/updatedoc', uploada.single('dimg'), async (req, res) => {
    try {
        // Connect to the MongoDB database
        const client = await MongoClient.connect('mongodb://localhost:27017/');
        const db = client.db('hospital');
        const collection = db.collection('doctors');

        const { doctorId, dname, dusername, dpassword, ddepartment, daddress, demail, dbloodgroup, dphone, dtiming, dsex} = req.body;
        
                // Save the filename in the database
                const dimg = req.file.filename;

        console.log(doctorId);
        // Update the patient record with the specified patientId
        const result = await collection.updateOne({ _id: new ObjectId(doctorId) }, { $set: { dname, dusername, dpassword, ddepartment, daddress, demail, dbloodgroup, dphone, dtiming, dsex, dimg} });

        // Check if the patient record was updated successfully
        if (result.modifiedCount === 1) {
            console.log(`patient with ID ${doctorId} updated successfully.`);
            return res.redirect('/adoc');
        } else {
            console.log(`patient with ID ${doctorId} not found.`);
        }

        // Redirect after successful deletion
    } catch (e) {
        console.error(`Error: ${e}`);
        return "An error occurred while updating the patient record.";
    }
});
app.post('/updatesta', uploadb.single('simg'), async (req, res) => {
    try {
        // Connect to the MongoDB database
        const client = await MongoClient.connect('mongodb://localhost:27017/');
        const db = client.db('hospital');
        const collection = db.collection('staffs');

        const { staffId, sname, sdepartment, saddress, semail, sbloodgroup, sphone, stiming, ssex} = req.body;
        
                // Save the filename in the database
                const simg = req.file.filename;

        console.log(staffId);
        // Update the patient record with the specified patientId
        const result = await collection.updateOne({ _id: new ObjectId(staffId) }, { $set: { sname, sdepartment, saddress, semail, sbloodgroup, sphone, stiming, ssex, simg} });

        // Check if the patient record was updated successfully
        if (result.modifiedCount === 1) {
            console.log(`patient with ID ${staffId} updated successfully.`);
            return res.redirect('/asta');
        } else {
            console.log(`patient with ID ${staffId} not found.`);
        }

        // Redirect after successful deletion
    } catch (e) {
        console.error(`Error: ${e}`);
        return "An error occurred while updating the patient record.";
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});