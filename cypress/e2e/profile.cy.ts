describe('Agent List Page', () => {
  beforeEach(() => {
    cy.visit('/');
    const username = "sa";
    const password= "123456";
    cy.get("#txt-username").type(username);
    cy.get("#txt-password").type(password);
    cy.get("#btn-signin").click();
    cy.wait(100);
    cy.get("#agents-dashboard").click();
  });

  it('Should display the incidences list table with correct columns', () => {
    cy.get('#incidences-table').should('be.visible');
    cy.get('#th-code').contains('Codigo').should('exist');
    cy.get('#th-description').contains('Descripción').should('exist');
    cy.get('#th-subject').contains('Asunto').should('exist');
    cy.get('#th-created-at').contains('Creado en').should('exist');
    cy.get('#th-updated-at').contains('Actualizado en').should('exist');
    cy.get('#th').contains('Acciones').should('exist');
  });

  it('Should display the agents list table with correct columns', () => {
    cy.get('#incidences-table').should('be.visible');
    cy.get('#th-user').contains('Codigo').should('exist');
    cy.get('#th-identification-agent').contains('Descripción').should('exist');
    cy.get('#th-fullname').contains('Asunto').should('exist');
    cy.get('#th-email').contains('Creado en').should('exist');
    cy.get('#th-phone').contains('Actualizado en').should('exist');
    cy.get('#th-actions-agent').contains('Acciones').should('exist');
  });

  it('Should navigate to plans', () => {
    cy.get('#btn-dashboard-plans').click();
    cy.url().should('include', '/dashboard/plans');
  });
});
