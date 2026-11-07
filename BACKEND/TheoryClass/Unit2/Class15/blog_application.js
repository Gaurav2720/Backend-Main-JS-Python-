const mongoose = require('mongoose');

// 1. Comment Schema
const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, 'Comment content is required'],
        minlength: [1, 'Comment cannot be empty'],
        maxlength: [500, 'Comment cannot exceed 500 characters']
    },
    author: {
        type: String,
        required: [true, 'Author name is required']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// 2. Post Schema
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Post title is required'],
        minlength: [5, 'Title must be at least 5 characters long'],
        maxlength: [100, 'Title cannot exceed 100 characters'],
        unique: true
    },
    content: {
        type: String,
        required: [true, 'Post content is required']
    },
    author: {
        type: String,
        required: [true, 'Author name is required']
    },
    status: {
        type: String,
        enum: {
            values: ['draft', 'published', 'archived'],
            message: '{VALUE} is not a valid status'
        },
        default: 'draft'
    },
    tags: [{
        type: String,
        trim: true
    }],
    comments: [commentSchema], // Embedded comments
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Pre-save middleware to update updatedAt timestamp
postSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Post = mongoose.model('Post', postSchema);

module.exports = {
    Post
};

console.log('Mongoose Schemas for Blog Application created successfully with validation rules.');
