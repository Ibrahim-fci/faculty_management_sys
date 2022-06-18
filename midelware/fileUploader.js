const crypto = require("crypto"); //model for generate strong random variable
const multer = require("multer"); //for uploading images from local computing
const GridFsStorage = require("multer-gridfs-storage");
// const Grid = require('gridfs-stream');
const path=require('path')
const mongoose=require('mongoose');
const router = require("../routes/api");

// const mongoURI = "mongodb://localhost/collegeSys";  ///database path of local storage
const mongoURI="mongodb://heroku_grqts9xv:tfrrn4uu3p1psval57p18i6vmj@ds157682.mlab.com:57682/heroku_grqts9xv" ;///database path of real server storage
const conn = mongoose.createConnection(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

let gfs;

conn.once("open", () => {
  //init stream

  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads"
  });
});
////prepare file to upload===================================================

const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});

 //file uploader to upload image and video
const upload= multer({ 
    storage: storage,
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        // if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg'  && ext !== '.mp4'  && ext !== '.mkv' && ext !== '.jfif' && ext !== '.mp3' && ext !== '.pdf' && ext !== '.doc') {
            
        //     return callback(null,false,req.flash('filterError','Only  image or video(.mp4) are allowed '))
        // }
        callback(null, true)
    }
})


  //FUNCION TO get file from mongo database
  async function getFile(req, res){

    var date = new Date();

      // res.writeHead(200, {
      // 'Date':date.toUTCString(),
      // 'Connection':'close',
      // 'Cache-Control':'private',
      // 'Content-Type':'video/mp4',
      // 'Server':'CustomStreamer/0.0.1',
      // });


    gfs.find({ filename: req.params.filename }).toArray((err, file) => {
      // check if files
      if (!file || file.length === 0) {
        return res
          .status(404)
          .send({ message: "this file not found", success: false });
      } else {
         gfs.openDownloadStreamByName(req.params.filename).pipe(res);
          // gfs1.createReadStream(req.params.filename).pipe(res);
          
      
        // const ss = fs.readFileSync(req.params.filename);
        // res.render("Student/profile", { im: ss });
      }
    });
  } 

  module.exports={
    getFile:getFile,
    upload:upload
  }