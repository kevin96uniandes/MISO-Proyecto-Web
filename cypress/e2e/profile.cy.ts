describe('Agent List Page', () => {
  beforeEach(() => {
    cy.visit('/');
    const username = "sa";
    const password= "123456";
    cy.get("#txt-username").type(username);
    cy.get("#txt-password").type(password);
    cy.get("#btn-signin").click();
    cy.wait(100);
    cy.get("#profile-dashboard").click();
  });

  it('Should display the incidences list table with correct columns', () => {
    cy.get('#incidences-table').should('be.visible');
    cy.get('#th-code').contains('Código').should('exist');
  });

  it('Should display the agents list table with correct columns', () => {
    cy.get('#incidences-table').should('be.visible');
    cy.get('#th-user').contains('Usuario').should('exist');
    cy.get('#th-identification-agent').contains('Identificación').should('exist');
    cy.get('#th-fullname').contains('Nombre Completo').should('exist');
    cy.get('#th-email').contains('Correo electrónico').should('exist');
    cy.get('#th-phone').contains('Teléfono').should('exist');
  });

  it('Should navigate to plans', () => {
    cy.get('#btn-dashboard-plans').click();
    cy.url().should('include', '/dashboard/plans');
  });
});
