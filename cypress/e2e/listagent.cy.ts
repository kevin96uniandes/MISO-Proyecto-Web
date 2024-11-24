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

  it('Should display the agent list table with correct columns', () => {
    cy.get('table').should('be.visible');
    cy.get('th').contains('Usuario').should('exist');
    cy.get('th').contains('Identificación').should('exist');
    cy.get('th').contains('Nombre Completo').should('exist');
    cy.get('th').contains('Correo electrónico').should('exist');
    cy.get('th').contains('Teléfono').should('exist');
    cy.get('th').contains('Acciones').should('exist');
  });

  it('Should filter the agent list based on search input', () => {
    cy.get('#field-search').type('John Doe');
    cy.get('table').find('tr').should('have.length', 1);
    cy.get('#field-search').should('be.visible');
  });

  it('Should navigate to create agent form and register a new agent', () => {
    cy.get('#btn-create-agent').click();
    cy.url().should('include', '/dashboard/register/agent');
  });

  it('Should navigate through pages using the paginator', () => {
    cy.get('table').should('be.visible');
    cy.get('mat-paginator').should('be.visible');
  });

});
