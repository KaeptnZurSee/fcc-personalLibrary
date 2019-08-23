/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
var mongoose = require('mongoose')
var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
var {Schema} = mongoose;

let bookSchema = new Schema({
  title: {type:String, required: true},
  comments: {type:[String], default: []}
})

let Books = mongoose.model('Books', bookSchema);

mongoose.connect(MONGODB_CONNECTION_STRING,(err,db)=>{
  if(err){
    console.log("connection to mongodb failed")
  }else{
    console.log('connected to mongodb')
  }
})

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      Books.find({},(err, books)=>{
        if(err){
          res.json({error:"could not get books"})
        }else{
          let responseArr = [];
          for(let book in books){
            let curBook = 
            responseArr.push({ title:books[book].title, _id:books[book]._id, comment_count:books[book].comments.length,comments:books[book].comments})
          }
          res.json({bookArray:responseArr})
        }
      })
    })
    
    .post(function (req, res){
      var title = req.body.title;
      let book = new Books({
      title: title
    });
    book.save((err)=>{
      if(err){
        res.json({error:"no title"})
      }else{
        res.json({title:title, id: book._id, comments: book.comments})
      }
    });
    })
    
    .delete(function(req, res){
      Books.deleteMany({},(err)=>{
        if(err){
          res.json({error:"could not delete the books"})
        }
        else{
          res.json({message:"deleted all books"})
        }
      });
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
    let result = Books.findOne({_id:bookid},(err,book)=>{
        if(err){
          res.json({error:"could not find a book with that id"})
        }else{
           res.json({title:book.title, id: book._id, comments: book.comments})
        }
      })
    if(!result){
      res.send("could not find a book with that id")
    }
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      Books.findOne({_id:bookid},(err,book)=>{
        if(err){
          res.json({error:"could not add a comment"})
        }else{
          book.comments.push(comment);
          book.save((err)=>{
            if(err){
              res.json({error:"could not save the comment"})
            }else{
              res.json({title:book.title, id: book._id, comments: book.comments})
            }
          })
        }
      })
  
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
    Books.deleteOne({_id:bookid},(err)=>{
      if(err){
        res.json({error:"could not delete"})
      }else{
        res.json({message:"successfully deleted"})
      }
    })
    });
  
};
