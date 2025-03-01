const mongoose = require('mongoose');
require("../db/conn");

// Define schema for QueryFrom file --> QueryFrom.html
const ComplaintSchema = new mongoose.Schema({

    Firstname: {
        type: String
    },
    Lastname: {
        type: String
    },
    Email: String,
    Branch: String,
    Query: String,
    OtherQuery: String,
    Computer: String,
    Phone: String,
    Note: String,
    Date: { type: String, default: new Date() }
});

const Complaint = module.exports = mongoose.model('Complaint', ComplaintSchema);


module.exports.registerComplaint = function (newComplaint, callback) {
    newComplaint.save(callback);
}

// module.exports.getAllComplaints = function (callback) {
//     Complaint.find(callback);
// }
module.exports.getAllComplaints = function (callback) {
    Complaint.find(callback);
}
module.exports.getAllsearch = function (callback) {
    Complaint.find({$or:[{author:{'$regex':req.query.dsearch}},{books:{'$regex':req.query.dsearch}}]});
}
