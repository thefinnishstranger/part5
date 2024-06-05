const loginWith = async (page, username, password) => {
    await page.getByRole('button', { name: 'log in' }).click()
    await page.getByTestId('username').fill(username)
    await page.getByTestId('password').fill(password)
    await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
    await page.getByRole('button', { name: 'new blog' }).click()
    await page.getByPlaceholder('title of the blog').fill(title)
    await page.getByPlaceholder('author of the blog').fill(author)
    await page.getByPlaceholder('url of the blog').fill(url)
    await page.getByRole('button', { name: 'create' }).click()
}

export { loginWith, createBlog }