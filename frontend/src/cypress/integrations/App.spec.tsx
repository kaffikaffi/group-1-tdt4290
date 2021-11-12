export {};

describe("App.tsx", () => {
	it("App component exists", () => {
		cy.visit("/");
		cy.get("#app").should("exist");
	});
});
