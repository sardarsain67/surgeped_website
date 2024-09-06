const mongoose = require('mongoose');

const useradminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const Useradmin = mongoose.model('Useradmin', useradminSchema);

module.exports = Useradmin;
