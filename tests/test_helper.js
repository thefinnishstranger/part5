const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
      title: "How to code HTML",
      author: "Nikolas Gustavson",
      url: "www.bla.com",
      likes: 21
    },
    {
      title: "How to be the best",
      author: "Nikolas Gustavson",
      url: "www.blabla.com",
      likes: 26
    }
  ];

const nonExistingId = async () => {
  const blog = new Blog({ content: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
  }

module.exports = {
  initialBlogs, nonExistingId, blogsInDb, usersInDb
}