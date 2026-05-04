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
})