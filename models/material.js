const mongoose = require("mongoose");


const materialScema = mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  Level: {
    type: String,
    required: true
  },
  FilePath: {
    type: String
  },
  DocId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "doctor"
  },
  materialuploader:{},
  materialType:String,
  unread:Boolean,
});

module.exports = mongoose.model("material", materialScema);
