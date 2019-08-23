/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body.bookArray, 'response should be an array');
        assert.property(res.body.bookArray[0], 'comment_count', 'Books in array should contain commentcount');
        assert.property(res.body.bookArray[0], 'title', 'Books in array should contain title');
        assert.property(res.body.bookArray[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
         chai.request(server)
      .post('/api/books')
      .send({title:"mytitle"})
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.equal(res.body.title,'mytitle');
        done();
      });
       
      });
      
      test('Test POST /api/books with no title given', function(done) {
         chai.request(server)
      .post('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'no title');
        done();
      });
      
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
         chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body.bookArray, 'response should be an array');
        assert.property(res.body.bookArray[0], 'comment_count', 'Books in array should contain comment_count');
        assert.property(res.body.bookArray[0], 'title', 'Books in array should contain title');
        assert.property(res.body.bookArray[0], '_id', 'Books in array should contain _id');
        done();
      });
       
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
         chai.request(server)
      .get('/api/books/42345')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.error,'could not find a book with that id' )
        done();
      });
     
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
         chai.request(server)
      .get('/api/books/5d5fb51c62b07a01ad78fad2')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.equal(res.body.title,'mytitle');
        assert.isArray(res.body.comments);
        done();
      });
      
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
         chai.request(server)
      .post('/api/books/5d5fb51c62b07a01ad78fad2')
      .send({comment:"hello"})
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body.comments, 'response should be an array');
        assert.operator(res.body.comments.length,'>=' ,1);
        done();
      });
      
      });
      
    });

  });

});
