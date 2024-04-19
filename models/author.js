const mongoose = require('mongoose')
const Book = require('./book')

const authorSchema = new mongoose.Schema(
    {name:{
            type: String,
            required: true
        }
    }
)
authorSchema.pre('findOneAndDelete', async function(next) {
    const documentToDelete = await this.model.findOne(this.getQuery());
    try {
      console.log('Author document:', documentToDelete);
      const books = await Book.find({ author: documentToDelete._id });
      console.log('Books associated with the author:', books);
      if (books.length > 0) {
        return next(new Error('This author has books still'));
      }
      next();
    } catch (err) {
      next(err);
    }
  });

module.exports = mongoose.model('Author', authorSchema)