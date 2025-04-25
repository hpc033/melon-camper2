import fs from "fs"
import puppeteer from "puppeteer"

import CREDENTIALS from "./credentials.json"
import { COOKIES_JSON, IS_HEADLESS, LOGIN_URL, loadBrowser } from "./shared"

const saveCookies = async () => {
  try {
    const cookies = await page.cookies()

    fs.writeFileSync(COOKIES_JSON, JSON.stringify(cookies, null, 2))
    console.log("Saved cookies to", COOKIES_JSON)
  } catch (error) {
    console.error("Error saving cookies:", error)
  }
}

const logIn = async () => {
  // 先设置全局超时（必须！）
  page.setDefaultNavigationTimeout(100000); // 100秒
  page.setDefaultTimeout(60000); // 60秒

  // 更可靠的登录逻辑
  await Promise.all([
    page.waitForNavigation({ 
      waitUntil: 'networkidle0', 
      timeout: 100000 
    }),
  await page.locator("#email").fill(CREDENTIALS.email)
  await page.locator("#pwd").fill(CREDENTIALS.password)
  await page.locator("#formSubmit").click()

}

const browser = await puppeteer.launch({ headless: IS_HEADLESS })
const page = await browser.newPage()

await loadBrowser(page, LOGIN_URL)

await logIn()
await saveCookies()

await browser.close()
