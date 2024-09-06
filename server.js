const express = require('express');
const mongoose = require('mongoose');
const compression = require('compression');
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');
const { check, validationResult } = require('express-validator');
//const upload = multer({ dest: 'uploads/' });


//for blogs
const { v4: uuidv4 } = require('uuid');
const session = require('express-session')
var QuillDeltaToHtml = require('quill-delta-to-html');
const {QuillDeltaToHtmlConverter} = require("quill-delta-to-html");


// Define middleware to authenticate user
const authMiddleware = (req, res, next) => {
    username1 = req.body.username;
    password1 = req.body.password;

    console.log("auth called", username1, password1)

    // Check if username and password match the expected values
    if (username1 == 'hello' && password1 == '123456') {
        console.log("inside auth if")
        // If the authentication is successful, call the next middleware in the chain
        req.session.user={username1};
        next();
    } else {
        // If the authentication fails, redirect the user to the login page
        res.redirect('/login');
    }
};

const requireauthblog = (req, res, next) => {



   
    if(req.session.user){
        next();
    } else {
        // If the authentication fails, redirect the user to the login page
        res.redirect('/login');
    }
};



const storageblog = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'blogsupload/');
    },
    filename: function (req, file, cb) {
        const ext = file.originalname.split('.').pop();
        const filename = `${uuidv4()}.${ext}`;
        cb(null, filename);
    },

    //code for file type check

    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            console.log("an image file needed")
            cb('Error: Please upload an image file');
        }
    }
});

const uploadblog = multer({ storage: storageblog });

const blogSchema = new mongoose.Schema({
    title: String,
    body: String,
    imagePath: String,
    date: Date
});


const Blog = mongoose.model('Blog', blogSchema, 'blogcollection');
//end for blogs


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const extension = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + extension)
    }
});
const upload = multer({ storage: storage });

const path = require('path');

mongoose.Promise = global.Promise;

const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
//const session = require('express-session');

const dbConnect =require('mongodb');
const port = process.env.PORT || 3008;
const { stringify } = require('querystring');


const app = express();
app.use(compression());



/*databases tabless*/


mongoose.connect('mongodb+srv://surgeUser1:mEkV9oZwOas7u4Rp@cluster0.wzlskbx.mongodb.net/feedSurge?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB 1 Career'))
    .catch((err) => console.error(err));


const db='mongodb+srv://surgeUser1:mEkV9oZwOas7u4Rp@cluster0.wzlskbx.mongodb.net/feedSurge?retryWrites=true&w=majority';
mongoose.connect(db).then(() =>{
    console.log("connection successfully");
}).catch((err)=> console.log("no connection"));

app.use(session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: false
}));

// Define a schema for the resume collection
const resumeSchema = new mongoose.Schema({
    name: String,
    email: String,
    job: String,
    resumePath: String,
    date : {
        type: Date,
        default: Date.now
    }
});


var UserSchema = mongoose.Schema({
    name: String,
    email: String,
    number: Number,
    purpose: String,
    date : {
        type: Date,
        default: Date.now
    }

});



const Resume = mongoose.model('Resume', resumeSchema, 'resumes');

var User = mongoose.model('User', UserSchema);
const client=mongoose.connect(db,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex:true,
        useFindAndModify:false
    },(err)=>{
               if(err){
            console.log(err)
            console.log("error");
        }
        else{
            console.log("successfully connected")
        }
    }
)




app.use(bodyParser.urlencoded({
    extended:true
}));

//register vue engine
app.set('view engine', 'ejs');
app.use(express.static('public'));

//for blogs
app.use(express.static('blogsupload'));

//end for blogs


app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.listen(port, () => {
    console.log('server started on port ' + port);
});


app.get('/admin-login', (req, res) => {
    res.send(`
     <form method="post" action="/admin-login">
      <input type="text" name="username" placeholder="Username"><br>
      <input type="password" name="password" placeholder="Password"><br>
      <button type="submit">Login</button>
    </form>
  `);
});



// Handle admin login requests
app.post('/admin-login', async (req, res) => {
    const { username, password } = req.body;

    // Retrieve the admin credentials from the node code
    const adminUsername = 'admin';
    const adminPassword = 'h$u4Nl50Ql6#2w';

    // Hash and salt the password using bcrypt
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(adminPassword, saltRounds);
    // Compare the username and password with the admin credentials
    //const match = await bcrypt.compare(password, adminPassword);
    //const match = password === adminPassword;
    const match = bcrypt.compareSync(password, hashedPassword);
    if (username === adminUsername && match) {
        // Create a session and redirect to the admin panel
        req.session.isAuthenticated = true;
        res.redirect('/admin-panel');
    } else {
        res.send('Invalid username or password');
    }
});

// Define a middleware to check for authenticated users
const requireAuth = (req, res, next) => {
    if (req.session.isAuthenticated) {
        next();
    } else {
        res.redirect('/admin-login');
    }
};



// Define the admin panel route
app.get('/admin-panel', requireAuth, async (req, res) => {
    try {
        const users = await User.find();
        const resumes = await Resume.find();

        res.send(`
            <h1>Admin Panel</h1>
            <button onclick="logout()">Logout</button>
            <h2>My Leads</h2>
            <button onclick="deleteAllLeads()">Delete All Leads</button>
            <button onclick="exportLeads()">Export All Leads</button>
            <table>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Purpose</th>
                    <th>Date</th>
                    <th>Action</th>
                </tr>
                ${users.map(user => `
                    <tr>
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td>${user.number}</td>
                        <td>${user.purpose}</td>
                        <td>${user.date}</td>
                        <td><button onclick="deleteUser('${user._id}')">Delete</button></td>
                    </tr>
                `).join('')}
            </table>

            <h2>Candidates</h2>
            <button onclick="deleteAllCandidates()">Delete All Candidates</button>
            <button onclick="exportCandidates()">Export All Candidates</button>
            <table>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Resume</th>
                    <th>Action</th>
                </tr>
                ${resumes.map(resume => `
                    <tr>
                        <td>${resume.name}</td>
                        <td>${resume.email}</td>
                        <td>${resume.job}</td>
                        <td><a href="/download?resumePath=${encodeURIComponent(resume.resumePath)}" download="${resume.name} Resume">Download</a></td>
                        <td><button onclick="deleteResume('${resume._id}')">Delete</button></td>
                    </tr>
                `).join('')}
            </table>

            <script>
                // Function to log out
                function logout() {
                    window.location.href = '/logout';
                }

                // Delete all leads
                function deleteAllLeads() {
                    if (confirm('Are you sure you want to delete all leads?')) {
                        fetch('/delete-all-leads', { method: 'DELETE' })
                            .then(() => window.location.reload())
                            .catch(err => console.error('Error deleting all leads:', err));
                    }
                }

                // Export all leads
                function exportLeads() {
                    window.location.href = '/export-leads';
                }

                // Delete all candidates
                function deleteAllCandidates() {
                    if (confirm('Are you sure you want to delete all candidates?')) {
                        fetch('/delete-all-candidates', { method: 'DELETE' })
                            .then(() => window.location.reload())
                            .catch(err => console.error('Error deleting all candidates:', err));
                    }
                }

                // Export all candidates
                function exportCandidates() {
                    window.location.href = '/export-candidates';
                }

                // Function to delete individual user
                function deleteUser(userId) {
                    if (confirm('Are you sure you want to delete this user?')) {
                        fetch('/deleteUser', {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ userId })
                        }).then(() => {
                            window.location.reload(); // Reload the page after deletion
                        }).catch(err => console.error('Error deleting user:', err));
                    }
                }

                // Function to delete individual resume
                function deleteResume(resumeId) {
                    if (confirm('Are you sure you want to delete this resume?')) {
                        fetch('/deleteResume', {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ resumeId })
                        }).then(() => {
                            window.location.reload(); // Reload the page after deletion
                        }).catch(err => console.error('Error deleting resume:', err));
                    }
                }
            </script>
        `);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Error fetching data');
    }
});




// Route to delete user
app.delete('/deleteUser', requireAuth, async (req, res) => {
    const { userId } = req.body;

    try {
        await User.findByIdAndDelete(userId);
        res.status(200).send('User deleted successfully');
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).send('Error deleting user');
    }
});

// Route to delete resume
app.delete('/deleteResume', requireAuth, async (req, res) => {
    const { resumeId } = req.body;

    try {
        await Resume.findByIdAndDelete(resumeId);
        res.status(200).send('Resume deleted successfully');
    } catch (err) {
        console.error('Error deleting resume:', err);
        res.status(500).send('Error deleting resume');
    }
});    
 /////////////
// Route to delete all leads
app.delete('/delete-all-leads', requireAuth, async (req, res) => {
    try {
        await User.deleteMany({});
        res.status(200).send('All leads deleted successfully');
    } catch (err) {
        console.error('Error deleting all leads:', err);
        res.status(500).send('Error deleting all leads');
    }
});

// Route to delete all candidates
app.delete('/delete-all-candidates', requireAuth, async (req, res) => {
    try {
        await Resume.deleteMany({});
        res.status(200).send('All candidates deleted successfully');
    } catch (err) {
        console.error('Error deleting all candidates:', err);
        res.status(500).send('Error deleting all candidates');
    }
});

////////////


// Route to export leads
app.get('/export-leads', requireAuth, async (req, res) => {
    try {
        const users = await User.find();

        const workbook = xlsx.utils.book_new();
        const worksheetData = users.map(user => ({
            Name: user.name,
            Email: user.email,
            Phone: user.number,
            Purpose: user.purpose,
            Date: user.date,
        }));

        const worksheet = xlsx.utils.json_to_sheet(worksheetData);
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Leads');

        const exportFileName = 'leads.xlsx';
        const exportFilePath = path.join(__dirname, exportFileName);

        xlsx.writeFile(workbook, exportFilePath);

        res.download(exportFilePath, exportFileName, (err) => {
            if (err) {
                console.error('Error exporting leads:', err);
                res.status(500).send('Failed to export leads');
            } else {
                fs.unlinkSync(exportFilePath);
            }
        });
    } catch (err) {
        console.error('Error exporting leads:', err);
        res.status(500).send('Error exporting leads');
    }
});

// Route to export candidates
app.get('/export-candidates', requireAuth, async (req, res) => {
    try {
        const resumes = await Resume.find();

        const workbook = xlsx.utils.book_new();
        const worksheetData = resumes.map(resume => ({
            Name: resume.name,
            Email: resume.email,
            Role: resume.job,
            ResumePath: resume.resumePath,
            Date: resume.date,
        }));

        const worksheet = xlsx.utils.json_to_sheet(worksheetData);
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Candidates');

        const exportFileName = 'candidates.xlsx';
        const exportFilePath = path.join(__dirname, exportFileName);

        xlsx.writeFile(workbook, exportFilePath);

        res.download(exportFilePath, exportFileName, (err) => {
            if (err) {
                console.error('Error exporting candidates:', err);
                res.status(500).send('Failed to export candidates');
            } else {
                fs.unlinkSync(exportFilePath);
            }
        });
    } catch (err) {
        console.error('Error exporting candidates:', err);
        res.status(500).send('Error exporting candidates');
    }
});


  

// Define the route for downloading resume files
app.get('/download', (req, res) => {
    const resumePath = req.query.resumePath;
    const file = path.join(__dirname, decodeURIComponent(resumePath));

    res.download(file, error => {
        if (error) {
            console.error(error);
            res.status(404).send('Failed to download file');
        }
    });
});



// Submit route
app.post(
  '/submit',
  // Add validation and sanitization
  [
    check('ntxt').trim().escape().not().isEmpty().withMessage('Name is required'),
    check('etxt').trim().isEmail().withMessage('Please enter a valid email address'),
    check('ttxt').trim().escape().isNumeric().withMessage('Phone number should be numeric'),
    check('ptxt').trim().escape().not().isEmpty().withMessage('Purpose is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If validation errors occur, show them to the user
      return res.status(400).json({ errors: errors.array() });
    }

    const { ntxt: name, etxt: email, ttxt: number, ptxt: purpose } = req.body;

    try {
      // Check if the email has already been used three or more times
      const existingSubmissions = await User.countDocuments({ email });
      if (existingSubmissions >= 3) {
        // If email has been used 3 or more times, show a message
        return res.status(400).send('You have already submitted this form 3 times with this email.');
      }

      // Create a new user object
      const user = new User({ name, email, number, purpose });

      // Save the user to the database
      await user.save();

      console.log(`${user.name} saved to the database.`);
      res.render('index');
    } catch (err) {
      console.error('Error saving user:', err);
      res.status(500).send('Internal Server Error');
    }
  }
);


// Handle POST requests to /upload
app.post('/upload', upload.single('resume'), (req, res) => {
    // Create a new resume object with the form data
    const newResume = new Resume({
        name: req.body.name,
        email: req.body.email,
        job: req.body.job,
        resumePath: req.file.path,
    });

    // Save the resume object to the collection
    newResume.save((err) => {
        if (err) {
            console.error(err);
            res.send('Error saving resume');
        } else {
            console.log('Resume saved to database:', newResume);
            res.send('Upload successful!');
        }
    });
});
app.get('/', (req, res) => {
    res.render('index');
})




app.get('/service', (req, res) => {
    res.render('service');
})


app.get('/about', (req, res) => {
    res.render('about');
})

app.get('/career', (req, res) => {
    res.render('carrer');
})


/*
app.get('/blogs', (req, res) => {
    res.render('blogs');
})
*/

//for blogs

// Set up a route to fetch all blog posts
app.get('/blogs', async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.render('blogs', { blogs });
    } catch (err) {
        console.error('Failed to fetch blogs', err);
        res.sendStatus(500);
    }
});

app.get('/blogs/:id', (req, res, next) => {
    const id = req.params.id;

    /*const isValidObjectId = mongoose.isValidObjectId(id);

    if (!isValidObjectId) {
        return res.status(400).send('Invalid object id');
    }
*/
    const objectId = new mongoose.Types.ObjectId(id);

    Blog.findById(objectId)
        .then((blog) => {
            res.render('blog22', { blog });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send('Error retrieving blog');
        });
});


// Define a route for the login page
app.get('/login', (req, res) => {
    // Render the login form HTML
    res.send(`
    <form method="POST" action="/login">
      <label>Username:</label>
      <input type="text" name="username"><br>
      <label>Password:</label>
      <input type="password" name="password"><br>
      <button type="submit">Log in</button>
    </form>
  `);
});

// Define a route to handle the POST request to the /login page
app.post('/login', authMiddleware, (req, res) => {
    // Redirect the user to the /upload-blog page after successful authentication
    res.redirect('/upload-blog');

});


app.post('/upload-blog', uploadblog.single('image'), async (req, res) => {
    let { title, body } = req.body;
    const imagePath = req.file.path;
    const date = new Date();
    //console.log(title, body)


    var delta = JSON.parse(body)
    var converter = new QuillDeltaToHtmlConverter(delta.ops, {})
    var html3 = converter.convert();
    console.log(html3)

    body=html3



    try {
        await Blog.create({ title, body, imagePath, date });
        res.render('success');
    } catch (err) {
        console.error('Failed to insert blog into MongoDB', err);
        res.status(500).send('Failed to insert blog');
    }
});


app.get('/success', (req, res) => {
    res.render('success');
});

// Step 1: Create a HTML form
app.get('/upload-blog',requireauthblog, (req, res) => {


    res.render('upload-blog');


});

// end for blog
app.get('/logout', (req, res) => {
    // Destroy the session
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Failed to log out');
        }
        // Redirect to admin login page after logging out
        res.redirect('/admin-login');
    });
});

