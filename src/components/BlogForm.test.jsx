import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import Blog from './Blog'
import { beforeEach, describe } from 'vitest'
import Togglable from './Togglable'
import BlogForm from './BlogForm'

test('<BlogForm /> calls event handler it received as props with the right details when a new blog is created', async () => {
    const createBlog = vi.fn()

    render(<BlogForm createBlog={createBlog} />)

    const user = userEvent.setup()

    const submitButton = screen.getByText('create')

    const titleInput = screen.getByPlaceholderText('title of the blog')
    const authorInput = screen.getByPlaceholderText('author of the blog')
    const urlInput = screen.getByPlaceholderText('url of the blog')

    await userEvent.type(titleInput, 'test title')
    await userEvent.type(authorInput, 'test author')
    await userEvent.type(urlInput, 'www.testurl.com')
    await user.click(submitButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('test title')
})