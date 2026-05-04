const {test, expect, beforeEach, describe} = require('@playwright/test')

describe('Blog app', () => {
   beforeEach(async ({ page, request }) => {
      await request.post('http://localhost:3003/api/testing/reset')
      await request.post('http://localhost:3003/api/users', {
         data: {
            name: 'Meikä Meikäläinen',
            username: 'test5',
            password: 'salakala'
         }
      })

      await page.goto('http://localhost:5173')
   })

   // 5.17: oletusarvoisen näkymän testaus
   test('Login form is shown as default view', async ({ page }) => {
      await expect(page.getByRole('button', {name: 'Log in'})).toBeVisible()
   })

   // 5.18: kirjautumiseen liittyvät testit
   describe('Login', () => {
      test('Successful with correct credentials', async ({page}) => {
         await page.getByRole('button', {name: 'Log in'}).click()
         await page.getByLabel('username').fill('test5')
         await page.getByLabel('password').fill('salakala')
         await page.getByRole('button', {name: 'Log in loser >:3'}).click()

         await expect(page.getByText('Logged in as: Meikä Meikäläinen')).toBeVisible()
      })

      test('Unsuccessful with incorrect credentials', async ({page}) => {
         await page.getByRole('button', {name: 'Log in'}).click()
         await page.getByLabel('username').fill('test5')
         await page.getByLabel('password').fill('salakavala')
         await page.getByRole('button', {name: 'Log in loser >:3'}).click()

         await expect(page.getByRole('button', {name: 'Log in loser >:3'})).toBeVisible()
      })
   })

   describe('When logged in', () => {
      beforeEach(async ({page, request}) => {
         // kirjaudutaan sisään ennen jokaista testiä
         await page.getByRole('button', {name: 'Log in'}).click()
         await page.getByLabel('username').fill('test5')
         await page.getByLabel('password').fill('salakala')
         await page.getByRole('button', {name: 'Log in loser >:3'}).click()
      })

      // 5.19: blogin luominen
      test('Creating a new blog successfully', async ({page}) => {
         await page.getByRole('button', {name: 'Add new'}).click()

         await page.getByLabel('title').fill('test519')
         await page.getByLabel('author').fill('testijäbä')
         await page.getByLabel('url').fill('https://testo.rane.org')
         await page.getByRole('button', {name: 'Add blog'}).click()
         await page.getByRole('button', {name: 'Cancel'}).click()

         await expect(page.getByText('Successfully added test519')).toBeVisible()
      })

      // 5.20: blogin tykkäys
      test('Blog liked successfully', async ({page}) => {
         //lisätään testiblogi
         await page.getByRole('button', {name: 'Add new'}).click()
         await page.getByLabel('title').fill('testiblogi')
         await page.getByLabel('author').fill('Testi Testonen')
         await page.getByLabel('url').fill('https://hieno.doma.in')
         await page.getByRole('button', {name: 'Add blog'}).click()
         await page.getByRole('button', {name: 'Cancel'}).click()

         const blog = page.getByText('testiblogi').locator('..')
         await blog.getByRole('button', {name: 'View'}).click()

         // haetaan liket regexillä, koska en osannut helpompaa keinoa :DD
         const likesText = await blog.getByText(/likes: \d+/).textContent()
         const originalLikes = Number(likesText.match(/\d+/)[0])
         await blog.getByRole('button', {name: 'Like'}).click()

         await expect(blog.getByText(`likes: ${originalLikes+1}`)).toBeVisible()
      })

      // 5.21: blogin poisto
      test('Blog removed successfully', async ({page}) => {
         //lisätään testiblogi
         await page.getByRole('button', {name: 'Add new'}).click()
         await page.getByLabel('title').fill('testiblogi2')
         await page.getByLabel('author').fill('Testi Testonen')
         await page.getByLabel('url').fill('https://hieno.doma.in')
         await page.getByRole('button', {name: 'Add blog'}).click()
         await page.getByRole('button', {name: 'Cancel'}).click()

         const blog = page.getByText('testiblogi2').locator('..')
         await blog.getByRole('button', {name: 'View'}).click()

         page.on('dialog', async dialog => {
            expect(dialog.type()).toBe('confirm')
            await dialog.accept()
         })

         await blog.getByRole('button', {name: 'Remove'}).click()
         await expect(page.getByText('Removed testiblogi2 by Testi Testonen')).toBeVisible()
      })
   })
})