describe('login form', () => {
  it('Validate initial components', () => {
    cy.visit('/');
    cy.wait(300);
    cy.get("#txt-username").should("exist");
    cy.get("#txt-password").should("exist");
    cy.get("#btn-signin").should("exist");
  });

  it('Username or password incorrect', () => {
    cy.visit('/');
    const username = "sa";
    const password= "12345";
    cy.get("#txt-username").type(username);
    cy.get("#txt-password").type(password);
    cy.get("#btn-signin").click();
    cy.wait(100);
    cy.get('#swal2-title').should('have.text', `Usuario o contraseña incorrectos`);
  });

  it('Login success', () => {
    cy.visit('/');
    const username = "sa";
    const password= "123456";
    cy.get("#txt-username").type(username);
    cy.get("#txt-password").type(password);
    cy.get("#btn-signin").click();
    cy.wait(100);
  });
})
