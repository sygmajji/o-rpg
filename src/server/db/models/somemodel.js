// @ts-check
// Require Mongoose
var mongoose = require('mongoose')

// Define a schema
var Schema = mongoose.Schema;
var SomeModelSchema = new Schema({
  name: String,
  date: Date
})

//Export function to create "SomeModel" model class
module.exports = mongoose.model('SomeModel', SomeModelSchema )