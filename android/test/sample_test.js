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
    const badgeCountElement = await driver.wait(
      until.elementLocated(
        By.xpath('//ion-badge[@data-test="notification-badge"]'),
        20000
      )
    );

    // Wait for the badge count element to be visible
    const visibleBadgeElement = await driver.wait(
      until.elementIsVisible(badgeCountElement),
      20000
    );

    if (visibleBadgeElement) {
      // Get the text of the badge count
      const badgeCountText = await badgeCountElement.getText();
      const badgeCount = parseInt(badgeCountText);

      // Assert that the badge count is greater than 0
      assert(badgeCount > 0, `Badge count is ${badgeCount}`);
    }

    await driver.sleep(5000);

    const notificationSuccessMessage = badgeCount > 0 ? true : false;
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
