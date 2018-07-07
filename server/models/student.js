const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    mail: { type: String },
    birthday: { type: String },
    sex: { type: String },
    bus1: { type: String },
    bus2: { type: String },
    bus3: { type: String }
});

module.exports = mongoose.model('Student', studentSchema ); // Student => create a collection students
