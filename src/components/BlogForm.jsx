

import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }
  return (
    <div className='formDiv'>
      <form onSubmit={addBlog}>
        <h2>Create a new blog</h2>
        <p>
          title: <input type='text' value={title} onChange={({ target }) => setTitle(target.value)} placeholder='title of the blog'></input>
        </p>
        <p>
          author: <input type='text' value={author} onChange={({ target }) => setAuthor(target.value)} placeholder='author of the blog'></input>
        </p>
        <p>
          url: <input type='text' value={url} onChange={({ target }) => setUrl(target.value)} placeholder='url of the blog'></input>
        </p>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default BlogForm