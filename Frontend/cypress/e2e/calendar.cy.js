describe("Calendar flow", () => {
  beforeEach(() => {
    // Clear all data stored in browser's localStorage
    // This removes any tokens or cached data from previous tests
    cy.clearLocalStorage();
    //Clear all browser cookies
    // Ensures no authentication cookies interfere with the test
    cy.clearCookies();
  });

  it("connects and disconnects Google Calendar", () => {
    cy.on('uncaught:exception', () => false);

    const now = new Date();
    const later = new Date(now.getTime() + 3600000);

    //INTERCEPT = catch and fake API requests
    cy.intercept("GET", "**/events*", {
      statusCode: 200,
      body: [{
        id: "1",
        title: "Test Event",
        start: now.toISOString(),
        end: later.toISOString(),
      }]
    }).as("getEvents");

    // INTERCEPT Google Calendar API
    cy.intercept("POST", "**/google-calendar/events", {
      statusCode: 200,
      body: [{
        Id: "google-1",
        Summary: "Google Event",
        Description: "From Google",
        Start: now.toISOString(),
        End: later.toISOString()
      }]
    }).as("getGoogleEvents");


    cy.visit("http://localhost:3000/Calendar?accessToken=test-token&refreshToken=refresh-token&expiresIn=3600");

        // cy.wait("@getEvents") pauses the test until that intercepted request happens
    cy.wait("@getEvents");

     // WAIT for the "getGoogleEvents" API call to complete
    // This ensures Google events are loaded
    cy.wait("@getGoogleEvents");

    // Wait a bit for page to settle
    cy.wait(2000);

    // Verify Google is connected
    cy.contains("button", "Disconnect Google", { timeout: 10000 }).should("exist");

    // Disconnect
    cy.contains("button", "Disconnect Google").click({ force: true });

    // Verify disconnection
    cy.contains("button", "Connect Google Calendar", { timeout: 5000 }).should("exist");
  });
});