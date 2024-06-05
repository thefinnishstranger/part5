import { useState, useEffect, useRef } from 'react'
import './App.css'
import Blog from './components/Blog'
import blogService from './services/blogService'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'




function App() {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [loginVisible, setLoginVisible] = useState(false)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService
      .fetchBlogs()
      .then(initialBlogs => {
        setBlogs(initialBlogs)
      })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])


  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with: ', username, ' ', password)

    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }

  }

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>
              cancel
          </button>
        </div>
      </div>
    )

  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    setSuccessMessage('Successfully logged out')
    setTimeout(() => {
      setSuccessMessage('')
    }, 5000)
    blogService.setToken(null)
    setUser(null)
  }

  const handleLike = async (event, blogId) => {
    event.preventDefault()
    try {
      const selectedBlog = await blogService.fetchParticularBlog(blogId)
      const updatedBlog = { ...selectedBlog, likes: selectedBlog.likes + 1 }
      const response = await blogService.update(blogId, updatedBlog)
      setBlogs(blogs.map(blog => blog.id === blogId ? response : blog))
    } catch (exception) {
      setErrorMessage('Failed to increase like')

      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
    }
  }

  const handleDelete = async (event, blogId) => {
    event.preventDefault()

    try {
      const selectedBlog = await blogService.fetchParticularBlog(blogId)
      const confirmed = window.confirm(`Are you sure you want to delete ${selectedBlog.title}`)
      if (confirmed) {
        blogService.deleteBlog(blogId)
        setBlogs(blogs.filter(blog => blog.id !== blogId))
        setSuccessMessage('Succesfully deleted the blog')
        setTimeout(() => {
          setSuccessMessage('')
        }, 5000)
      }
    } catch (exception) {
      setErrorMessage('deletion not successful')
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
    }

  }


  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      const savedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(savedBlog))
      setSuccessMessage(`${blogObject.title} has been successfully added to the blogs!`)
      setTimeout(() => {
        setSuccessMessage('')
      }, 5000)
    } catch (exception) {
      setErrorMessage('Failed to create blog')

      console.log(blogService.token)


      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
    }
  }




  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={errorMessage} />
      <Notification message={successMessage} />

      {user === null
        ? loginForm()
        : <div>
          <p>{user.name} logged-in</p>
          <button onClick={handleLogout}>logout</button>
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
          {blogs
            .sort((a, b) => b.likes - a.likes)
            .map(blog =>
              <Blog key={blog.id} blog={blog} handleLike={handleLike} handleDelete={handleDelete} />
            )}
        </div>
      }
      <div>
        <h4>
          Blog app, made by <i>Nikolas Gustavson
            </i>
        </h4>
      </div>
    </div>
  )
}

export default App
