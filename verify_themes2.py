import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            record_video_dir="/tmp/",
            record_video_size={"width": 375, "height": 812},
            viewport={"width": 375, "height": 812}
        )
        page = await context.new_page()

        print("Navigating to localhost:5176...")
        await page.goto("http://localhost:5176", wait_until="networkidle")

        # In case we skip lockscreen
        await page.wait_for_timeout(2000)

        bypass_button = page.locator("button:has-text('デバッグ用：強制的にアプリを開く')")
        if await bypass_button.is_visible():
            await bypass_button.click()
            await page.wait_for_timeout(1000)
            print("Logging in...")
            await page.fill("input[type='email']", "test@example.com")
            await page.fill("input[type='password']", "password123")
            await page.click("button:has-text('ログイン')")
            await page.wait_for_timeout(3000)
        else:
            print("Already logged in or bypassed.")

        print("Clicking Voice tab...")
        await page.locator("button", has_text="音声ルーム").click()
        await page.wait_for_timeout(2000)

        print("Taking Voice Main Screen screenshot...")
        await page.screenshot(path="screenshot_voice_main.png")

        print("Opening Voice Room Settings...")
        # Find the Plus icon inside the button. The previous selector might be too specific.
        # Alternatively, find the button inside the absolute bottom right div.
        await page.locator(".absolute.bottom-24.right-6 button").click()
        await page.wait_for_timeout(1000)

        print("Taking Voice Settings Screen screenshot...")
        await page.screenshot(path="screenshot_voice_settings.png")

        print("Starting Voice Room...")
        await page.locator("button", has_text="配信を開始する").click()
        await page.wait_for_timeout(2000)

        print("Taking Active Voice Room screenshot...")
        await page.screenshot(path="screenshot_voice_active.png")

        print("Closing browser...")
        video_path = await page.video.path()
        await browser.close()
        print(f"Video saved to {video_path}")

asyncio.run(main())
