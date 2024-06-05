const { test, after, beforeEach, describe } = require('node:test');
const assert = require('assert'); // Import the assert module
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app'); // Ensure the path is correct
const helper = require('./test_helper'); // Import the helper functions
const bcrypt = require('bcrypt')
const User = require('../models/user')

const Blog = require('../models/blog'); // Ensure the path is correct
const { log, Console } = require('console');

const api = supertest(app);

describe('when there is initially some blogs saved', () => {
    beforeEach(async () => {
        await Blog.deleteMany({});
      
        const blogObjects = helper.initialBlogs
          .map(blog => new Blog(blog))
        const promiseArray = blogObjects.map(blog => blog.save())
        await Promise.all(promiseArray)
      })

      test('blog has an id', async () => {
        const response = await api.get('/api/blogs')
        const blog = response.body[0]
        assert.ok(blog.id)
    })
    
    test('blogs are returned as json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/);
    });
    
    test('all blogs are returned', async () => {
      const response = await api.get('/api/blogs');
      assert.strictEqual(response.body.length, helper.initialBlogs.length);
    });

    describe('viewing a specific blog', () => {
        test('the first blog is something about HTML', async () => {
            const response = await api.get('/api/blogs');
            const titles = response.body.map(e => e.title); // Use the correct property 'title'
            assert(titles.includes('How to code HTML'));
          });

          test('finding a specific blog', async () => {
            const blogsAtStart = await helper.blogsInDb()
        
            const blogToView = blogsAtStart[0]
        
            const resultBlog = await api
                .get(`/api/blogs/${blogToView.id}`)
                .expect(200)
                .expect('Content-Type', /application\/json/)
        
            assert.deepStrictEqual(resultBlog.body, blogToView)
        })
    })
    
    describe('adding a blog', () => {
        test('a valid blog can be added', async () => {
          const user = await User.findById(body.userId);
            const newBlog = {
              title: "I am the best",
              author: "Nikolas Gustavson",
              url: "www.blablabla.com",
              likes: 69,
              userId: user._id
            }
            console.log('show me bitch', newBlog);
          
            await api
              .post('/api/blogs')
              .send(newBlog)
              .expect(201)
              .expect('Content-Type', /application\/json/);
          
            const response = await api.get('/api/blogs');
            const contents = response.body.map(r => r.title);
          
            assert.strictEqual(response.body.length, helper.initialBlogs.length + 1);
            assert(contents.includes('I am the best'));
          });
          test('blog without title is not added', async () => {
            const newBlog = {
              title: "",
              author: "Nikolas Gustavson",
              url: "www.no.com",
              likes: 1,
              userId: "6655a4bbb8e2ff77c0e9f994"
            };

            const initialBlogs = await helper.blogsInDb()
          
            await api
              .post('/api/blogs')
              .send(newBlog)
              .expect(400)
              .expect('Content-Type', /application\/json/);
          
            const blogsAtEnd = await helper.blogsInDb();
          
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
          });
          
          test('a valid blog can be added', async () => {
            const newBlog = {
              title: "i am awesome",
              author: "Nikolas Gustavson",
              url: "www.yes.com",
              likes: 20,
              userId: "6655a4bbb8e2ff77c0e9f994"
            };
          
            await api
              .post('/api/blogs')
              .send(newBlog)
              .expect(201)
              .expect('Content-Type', /application\/json/);
          
            const blogsAtEnd = await helper.blogsInDb();
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);
          
            const titles = blogsAtEnd.map(n => n.title);
            assert(titles.includes('i am awesome'));
          });
    })
    
    
   describe('deleting a blog', () => {
    test('a blog can be deleted', async () => {
        const blogsAtStart = await helper.blogsInDb()
    
        const blogToDelete = blogsAtStart[0]
    
        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)
    
        const blogsAtEnd = await helper.blogsInDb()
    
        const contents = blogsAtEnd.map(r => r.title)
        assert(!contents.includes(blogToDelete.title))
    
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })
   })
    
    
    describe('adding without the likes paramater', () => {
        test('likes will be zero if not specified', async () => {
            const newBlog = {
                title: "i am awesome",
                author: "Nikolas Gustavson",
                url: "www.yes.com",
                userId: " 6655a4bbb8e2ff77c0e9f994"
              };
            
              await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/);
        
              const blogsAtEnd = await helper.blogsInDb()
              const lastBlog = blogsAtEnd[blogsAtEnd.length - 1]
              assert.strictEqual(lastBlog.likes, 0)
        })
    })

    describe('updating a blog is successful', () => {
        test('updating a blog', async () => {
            const newBlog = {
                title: "i am awesome",
                author: "Nikolas Gustavson",
                url: "www.yes.com",
                likes: 200
              }
            const initialBlogs = await helper.blogsInDb()
            const blogToUpdate = initialBlogs[0]

            const response = await api
              .put(`/api/blogs/${blogToUpdate.id}`)
              .send(newBlog)
              .expect(200)
            console.log('this is response data', response.body)
            
            const updatedBlog = response.body
            assert.strictEqual(updatedBlog.title, newBlog.title)
            assert.strictEqual(updatedBlog.author, newBlog.author)
            assert.strictEqual(updatedBlog.url, newBlog.url)
            assert.strictEqual(updatedBlog.likes, newBlog.likes)
        })
    })
    

})

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })

        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()
    
        const newUser = {
          username: 'nikolasgustavson',
          name: 'Nikolas Gustavson',
          password: 'salainen',
        }
    
        await api
          .post('/api/users')
          .send(newUser)
          .expect(201)
          .expect('Content-Type', /application\/json/)
    
        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
    
        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))
      })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'superuser',
            password: 'salainen'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('expected `username` to be unique'))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)

    })
})



after(async () => {
  await mongoose.connection.close();
});
