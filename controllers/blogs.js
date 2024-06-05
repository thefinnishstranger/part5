const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')


blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('userId', { username: 1, name: 1 });
    response.json(blogs);
});

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
        if (blog) {
            response.json(blog)
        } else {
            response.status(404).end()
        }
});

blogsRouter.delete('/:id', async (request, response) => {
    
    const token = request.token
    const blog = await Blog.findById(request.params.id)
    console.log('token: ', token)
    console.log('blog to delete', blog)

    if (!token) {
        response.status(401).json({ error: 'token missing' })
    }

    const decodedToken = jwt.verify(token, process.env.SECRET)
    console.log('decoded token: ', decodedToken)
    const user = await User.findById(decodedToken.id)
    console.log('user: ', user);

    if (!decodedToken.id) {
        return response.status(401).json({ error: 'invalid token' })
    }

    if (blog.userId.toString() !== user._id.toString()) {
        await Blog.findByIdAndDelete(request.params.id)
        response.status(204).end()
    } else {
        return response.status(403).json({ error: 'unauthorized to delete this blog' })
    }
})

blogsRouter.post('/', async (request, response) => {
    const body = request.body
    console.log(request.token)
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id)

    if (!user) {
        return response.status(400).json({ error: 'User not found' });
    }

    if (!body.title || body.title.trim() === "") {
        return response.status(400).json({ error: 'Title is missing or empty' });
    }

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        userId: user._id  
    });

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    response.status(201).json(savedBlog);
});

blogsRouter.put('/:id', async (request, response) => {
    const updatedBlog = request.body
    const result = await Blog.findByIdAndUpdate(request.params.id, updatedBlog, { new: true })

    if (result) {
       response.json(result)
       response.status(200).end()
    } else {
       response.status(404).end()
    }
    
})


module.exports = blogsRouter;
