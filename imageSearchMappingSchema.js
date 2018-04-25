var mongoose     = require('mongoose');

var Schema       = mongoose.Schema;

var imageSearchMappingSchema = new Schema({
	searchTerm : String,
	when : Date
});

module.exports = mongoose.model('imageSearchMapping', imageSearchMappingSchema);