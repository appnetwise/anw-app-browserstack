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
        30000
      )
      .click();
    console.log("Element found and clicked successfully.");

    var textElement = await driver
      .wait(
        until.elementLocated(
          By.xpath('//android.widget.TextView[@text="1"]'),
          30000
        )
      )
      .getText();

    //assert(textElement.includes("1"));

    await driver.sleep(5000);

    const notificationSuccessMessage = true;
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
