describe('Incidents Dashboard', () => {
  beforeEach(() => {
    cy.visit('/');
    const username = "sa";
    const password= "123456";
    cy.get("#txt-username").type(username);
    cy.get("#txt-password").type(password);
    cy.get("#btn-signin").click();
    cy.wait(100);
    cy.get("#incident-board").click();
  });

  it('should load the page and display all filter fields', () => {
    cy.get('#channel').should('exist');
    cy.get('#status').should('exist');
    cy.get('[formcontrolname="fecha_inicio"]').should('exist');
    cy.get('[formcontrolname="fecha_fin"]').should('exist');
  });

  it('should apply filters correctly', () => {
    cy.get('#channel').click();
    cy.contains('mat-option', 'Llamada Telefónica').click();

    cy.get('#status').click();
    cy.contains('mat-option', 'Abierto').click();

    cy.get('button[type="submit"]').first().click();
    cy.wait(100);
    cy.get('#paginator').last().scrollIntoView();

    cy.get('#table_incident').find('tr').should('have.length.greaterThan', 1);
  });

  it('should clear filters', () => {
    cy.get('#channel').click();
    cy.contains('mat-option', 'Llamada Telefónica').click();

    cy.get('#status').click();
    cy.contains('mat-option', 'Abierto').click();

    cy.get('button').contains('LIMPIAR FILTRO').click();

    cy.get('[formcontrolname="canal_id"]').should('have.value', '');
    cy.get('[formcontrolname="estado_id"]').should('have.value', '');
  });

  it('should paginate through the table', () => {
    cy.wait(100);
    cy.get('#paginator').last().scrollIntoView();
    cy.get('table').should('exist');
    cy.get('mat-paginator').should('exist');
    cy.get('button.mat-mdc-tooltip-trigger:nth-child(4) > span:nth-child(4)').click();
    cy.get('button.mat-mdc-tooltip-trigger:nth-child(3) > span:nth-child(4)').click();
  });

  it('should display correct incident details in the table', () => {
    cy.wait(100);
    cy.get('#paginator').last().scrollIntoView();
    cy.get('th').contains('Código').should('exist');
    cy.get('th').contains('Estado').should('exist');
    cy.get('th').contains('Canal').should('exist');
    cy.get('th').contains('Tipo de incidencia').should('exist');
    cy.get('th').contains('Fecha de actualización').should('exist');
  });

});
