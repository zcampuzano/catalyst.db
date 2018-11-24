/* ===================
Import Node Modules
=================== */
const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise; // Configure Mongoose Promises
const Schema = mongoose.Schema; // Import Schema from Mongoose

const gameSchema = new Schema({
    date: {type: Date, required: true},
    home: {
      ID: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
      athletes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Athlete' }], // roster
      stat: { type: mongoose.Schema.Types.ObjectId, ref: 'Basketball' }
    },
    away: {
        ID: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
        athletes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Athlete' }], // roster
        stat: { type: mongoose.Schema.Types.ObjectId, ref: 'Basketball' }
    },

});

module.exports = mongoose.model('Game', gameSchema);

module.exports.createGame = function(newGameSchema, callback) {
    newGameSchema.save(callback);
}