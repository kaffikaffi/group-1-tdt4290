import "cypress-file-upload";

export {};

describe("Processing components exist", () => {
	it("Home page exists", () => {
		cy.visit("/processing");
		cy.get("#home").should("exist");
	});
});

describe("Authentication exist and works", () => {
	it("Auth component exist", () => {
		cy.get("#auth").should("exist");
	});

	it("Username input exists", () => {
		cy.get("#usernameInput").should("exist");
	});

	it("Password input exist", () => {
		cy.get("#passwordInput").should("exist");
	});

	it("Username input works", () => {
		cy.get("#usernameInput").type("PMoney");
	});

	it("Password input works", () => {
		cy.get("#passwordInput").type("MtErmS213");
	});

	it("Login works", () => {
		cy.get("#upload").should("not.exist");
		cy.get("#authBtn").click();
		cy.get("#upload").should("exist");
	});
});

describe("Upload component exist", () => {
	it("Upload component exists", () => {
		cy.get("#upload").should("exist");
	});

	it("TextArea component exists", () => {
		cy.get("#textarea").should("exist");
	});

	it("Processing buttons should not exist", () => {
		cy.get("#textarea").clear();
		cy.get("#btn-processing-text").should("not.exist");
	});

	it("Utterances component should not exist", () => {
		cy.get("#utterances").should("not.exist");
	});
});

describe("Upload component works", () => {
	it("Text area is filled successfully", () => {
		cy.get("#textarea").type(
			"U.S.$5,000,000,000 Euro Medium Term Note Programme JPY500,000,000 2.30 per cent. Reverse Dual Currency Notes due 2023 This document constitutes the Pricing Supplement relating to the issue of Notes described herein. Terms used herein shall be deemed to be defined as such for the purposes of the Conditions set forth in the Information Memorandum dated 28th June, 2002. This Pricing Supplement must be read in conjunction with such Information Memorandum."
		); // Type text into textarea
		cy.get("#textarea").contains(
			"U.S.$5,000,000,000 Euro Medium Term Note Programme JPY500,000,000 2.30 per cent. Reverse Dual Currency Notes due 2023 This document constitutes the Pricing Supplement relating to the issue of Notes described herein. Terms used herein shall be deemed to be defined as such for the purposes of the Conditions set forth in the Information Memorandum dated 28th June, 2002. This Pricing Supplement must be read in conjunction with such Information Memorandum."
		); // Check if text was inserted
		cy.get("#btn-processing-text").should("exist"); // Check if text processing button displayed
	});

	it("Processing of text was successfull", () => {
		cy.get("#btn-processing-text").should("exist"); // Check if text processing button exist after switch
		cy.get("#btn-processing-text").click(); // Click processing of file
		// eslint-disable-next-line cypress/no-unnecessary-waiting
		cy.wait(7000); // Wait for 5 seconds
		cy.get("#utterances").should("exist"); // Utterances should be generated and displayed
	});
});
