const mongoose = require('mongoose');
const { boolean } = require('webidl-conversions');

const RevisionSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        unique: false,
    },
    author_ip: {
        type: String,
        unique: false,
    },
    is_hidden: {
        type: Boolean,
        default: false,
    }
});

const articleSchema = new mongoose.Schema({
    url_title: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true,
        unique: false,
    },
    revisions: {
        type: [RevisionSchema],
        required: true,
        default: [],
    },
    is_deleted: {
        type: Boolean,
        default: false,
    },
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;