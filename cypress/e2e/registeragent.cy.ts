describe('Agent Registration Form', () => {
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

  it('Should register an agent successfully', () => {
    cy.get('button').contains('CREAR AGENTE').click();
    cy.get('mat-select[name="food"]').click();
    cy.get('mat-option').contains('Español').click();
    cy.get('#nombre_completo').type('John');
    cy.get('#apellido').type('Doe');
  });


  it('Should show validation errors for required fields', () => {
    cy.get('button').contains('CREAR AGENTE').click();
    cy.get('#nombre_completo').click({ force: true });
    cy.get('body').click();
    cy.get('mat-error').contains('Campo requerido').should('exist');
  });

  it('Should show error when password and confirm password do not match', () => {
    cy.get('button').contains('CREAR AGENTE').click();
    cy.get('#nombre_completo').type('Jane');
    cy.get('#apellido').type('Doe');
    cy.get('#correo_electronico').type('jane.doe@example.com', { force: true });
    cy.get('#contrasena').type('Password123', { force: true });
    cy.get('#confirmar_contrasena').type('Password456', { force: true });
    cy.get('body').click();
    cy.get('mat-error').contains('Las contraseñas no coinciden').should('exist');
  });


});
