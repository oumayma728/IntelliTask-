describe("Chatbot test", () => {
  beforeEach(() => {
    // Clear all data stored in browser's localStorage
    // This removes any tokens or cached data from previous tests
    cy.clearLocalStorage();
    //Clear all browser cookies
    // Ensures no authentication cookies interfere with the test
    cy.clearCookies();
  });

  it("Connect to chatbot", () => {
    cy.on('uncaught:exception', () => false);

    const now = new Date();
    const later = new Date(now.getTime() + 3600000);

    //INTERCEPT = catch and fake API requests
    cy.intercept("POST", "**/ChatBot*", {
      statusCode: 200,
      body: [{
        UserInput: "Hello",
      }]
    }).as("sendMessageToAI");

cy.visit("http://localhost:3000/Calendar");

 // Open chatbot by clicking the button in the navbar
cy.screenshot("before-click");
cy.contains("button", "SideKick", { timeout: 10000 }).click({ force: true });

 // Type a message into chatbot input
cy.get('input[placeholder="Type a message..."]').type("Hello", { force: true });

 // Click the send button
    cy.contains("button", "Send").click({ force: true });
    cy.wait("@sendMessageToAI");

    // Verify the message appears in the chat window
    cy.contains("Hello").should("exist");

    // Close the chatbot
    cy.contains("button", "Close").click({ force: true });

});
});