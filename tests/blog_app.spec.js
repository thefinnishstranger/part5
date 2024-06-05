const { test, describe, expect, beforeEach } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {

    beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173')
    })

    test('front page can be opened', async ({ page }) => {

        const locator = await page.getByText('Blogs')
        await expect(locator).toBeVisible()
        await expect(page.getByText('Blog app, made by Nikolas Gustavson')).toBeVisible()
    })

    test('user can log in', async ({ page }) => {
        await loginWith(page, 'goose', 'oogabooga')
        await expect(page.getByText('Silly Gooser logged-in')).toBeVisible()
      })

    describe('when logged in', () => {

        beforeEach(async ({ page }) => {
            await loginWith(page, 'goose', 'oogabooga')
        })
    
        test('a new blog can be created', async ({ page }) => {
            await createBlog(page, 'hello world', 'explorer', 'www.world.com')
            await expect(page.getByText('hello world has been successfully added to the blogs!')).toBeVisible()
        })

        test('a blog can be liked', async ({ page }) => {
            const blogDiv = await page.getByText('Title of the blog: Goosing yo mamaAuthor of the blog: Silly GooserviewUrl: www.')
            await blogDiv.getByRole('button', { name: 'view' }).click()

          

            const likesElement = await blogDiv.getByText(/Likes: \d+/)
            const initialLikesText = await likesElement.textContent()
            const initialLikes = parseInt(initialLikesText.replace('Likes: ', ''))
            
            await page.getByRole('button', { name: 'like' }).click()
            await page.waitForTimeout(1000)
           

            const newLikesElement = await blogDiv.getByText(/Likes: \d+/)
            const finalLikesText = await newLikesElement.textContent()
            const finalLikes = parseInt(finalLikesText.replace('Likes: ', ''))
            

            await expect(finalLikes).toBe(initialLikes + 1)
        })

        test('a blog can be deleted', async ({ page }) => {
            const blogDiv = await page.getByText('Title of the blog: hello worldAuthor of the blog: explorerviewUrl: www.world.').first()
            await blogDiv.getByRole('button', { name: 'view' }).first().click()

            page.on('dialog', async dialog => {
                await dialog.accept()
            })

            await blogDiv.getByRole('button', { name: 'delete' }).click()

            await page.waitForTimeout(2000)

            await expect(blogDiv).not.toBeVisible()
        })

        test('blogs are in correct order', async ({ page }) => {
            const blogDivs = await page.$$('.blogBlock')

            const likes = []
            for (const blogDiv of blogDivs) {
                await blogDiv.getByRole('button', { name: 'view' }).click()
                const likesText = await blogDiv.locator('.blogLikes').textContent()
                const likesCount = parseInt(likesText.match(/\d+/)[0])
                likes.push(likesCount)
            }

            for (let i = 0; i < likes.length - 1; i++) {
                expect(likes[i]).toBeGreaterThanOrEqual(likes[i - 1])
            }
        })

        

        
    })

    
})

describe('new account creation in the blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('http://localhost:3001/api/testing/reset')
        await request.post('http://localhost:3001/api/users', {
            data: {
                name: 'Testing user',
                username: 'TestingAccount',
                password: 'salainen'
            }
        })

        await page.goto('http://localhost:5173')
    })

    test('front page can be opened', async ({ page }) => {

        const locator = await page.getByText('Blogs')
        await expect(locator).toBeVisible()
        await expect(page.getByText('Blog app, made by Nikolas Gustavson')).toBeVisible()
    })

    test('user can log in', async ({ page }) => {
        await page.getByRole('button', { name: 'log in' }).click()
        await page.getByTestId('username').fill('TestingAccount')
        await page.getByTestId('password').fill('salainen')
        await page.getByRole('button', { name: 'login' }).click()
        await expect(page.getByText('Testing user logged-in')).toBeVisible()
      })

    test('login fails with wrong password', async ({ page }) => {
        await page.getByRole('button', { name: 'log in' }).click()
        await page.getByTestId('username').fill('bozo')
        await page.getByTestId('password').fill('nope')
        await page.getByRole('button', { name: 'login' }).click()

        const errorDiv = await page.locator('.success')

        await expect(errorDiv).toContainText('Wrong credentials')
        await expect(errorDiv).toHaveCSS('border-style', 'none')
        await expect(errorDiv).toHaveCSS('color', 'rgb(33, 53, 71)')
        await expect(page.getByText('Testing user logged-in')).not.toBeVisible()
    })

    test('i dont even know what this is for', async () => {

    })


})