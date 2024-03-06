const { Builder, By, until } = require("selenium-webdriver");

var buildDriver = function () {
  return new Builder().usingServer("http://127.0.0.1:4723/wd/hub").build();
};

async function bstackSampleTest() {
  let driver = buildDriver();
  try {
    console.log("Waiting for the element...");
    await driver
      .wait(
        until.elementLocated(
          By.xpath("//android.widget.Button[@text='GRAB A RIDE']")
        ),
        60000
      )
      .click();
    console.log("Element found and clicked successfully.");

    // Locate the ion-badge representing the badge count
    let badgeCount;

    try {
      // Locate the ion-badge Element
      const badgeElement = await driver.wait(
        until.elementLocated(
          By.xpath('//ion-badge[@data-test="notification-badge"]')
        ),
        3000
      );

      // Get the Badge Count
      const badgeCountText = await badgeElement.getText();
      badgeCount = parseInt(badgeCountText);

      // Assert the Badge Count
      assert(badgeCount >= expectedBadgeCount, `Badge count is ${badgeCount}`);
    } catch (error) {
      // Handle the case where the badge is not visible or not found
      console.error("Badge not found or not visible:", error);

      // Optionally, you can set badgeCount to a default value or perform additional actions
      badgeCount = 0;
    }

    await driver.sleep(5000);

    const notificationSuccessMessage = (badgeCount = 0 ? true : false);
    if (notificationSuccessMessage) {
      console.log("Notification sent successfully.");
      await driver.executeScript(
        'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "Notification sent successfully"}}'
      );
    } else {
      console.error("Notification failed to send.");
      await driver.executeScript(
        'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "Notification failed to send"}}'
      );
    }
  } catch (e) {
    console.error("Error in test:", e);
    await driver.executeScript(
      'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "Test execution error"}}'
    );
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
}

bstackSampleTest();
