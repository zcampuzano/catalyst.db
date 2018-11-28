/* ===================
   Import Node Modules
=================== */
const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise; // Configure Mongoose Promises
const Schema = mongoose.Schema; // Import Schema from Mongoose


// Validate Function to check username length
let nameLengthChecker = (name) => {
    // Check if username exists
    if (!name) {
        return false; // Return error
    } else {
        // Check length of username string
        if (name.length < 1 || name.length > 20) {
            return false; // Return error if does not meet length requirement
        } else {
            return true; // Return as valid username
        }
    }
};

// Validate Function to check if valid username format
let validName = (name) => {
    // Check if username exists
    if (!name) {
        return false; // Return error
    } else {
        // Regular expression to test if username format is valid
        const regExp = new RegExp(/^[a-zA-Z0-9 '.-]+$/);
        return regExp.test(name); // Return regular expression test result (true or false)
    }
};


// Array of Username validators
const usernameValidators = [
    // First Username validator
    {
        validator: nameLengthChecker,
        message: 'Name must be at least 1 character but no more than 20'
    },
    // Second username validator
    {
        validator: validName,
        message: 'Name must only include characters, spaces, dashes, and periods'
    }
];

const athleteSchema = new Schema({
    firstname: { type: String, required: true, validate: usernameValidators },
    lastname: { type: String, required: true, validate: usernameValidators },
    number: { type: Number, required: true },
    position: { type: String, required: false },
    basketballStat : { type : mongoose.Schema.Types.ObjectId, ref: 'Basketball' , sparse : true },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' }
});

module.exports = mongoose.model('Athlete', athleteSchema);

module.exports.createAthlete = function(newAthlete, callback){
    newAthlete.save(callback);
}