describe('user query form', () => {
  it('Login success', () => {
    // login del usuario exitoso
    cy.visit('/');
    const username = "sa";
    const password= "123456";
    cy.get("#txt-username").type(username);
    cy.get("#txt-password").type(password);
    cy.get("#btn-signin").click();
    cy.wait(100);

    // menu
    cy.get("#incident-dashboard").click();
    cy.get("#user-query-title").should('have.text', `Consulta información del usuario`); 

  });
  it('go to ranking success', () => {
    cy.visit('/');
    const username = "sa";
    const password= "123456";
    cy.get("#txt-username").type(username);
    cy.get("#txt-password").type(password);
    cy.get("#btn-signin").click();
    cy.wait(100);

    const identityNumber = '1030661927'
    cy.get("#incident-dashboard").click();
    cy.wait(100);
  
    cy.get('#identity-number').type(identityNumber, { force: true });

    cy.get('#identity-type').click();
    cy.wait(100);

    cy.get('mat-option[value="Cédula_Cuidadania"]').click();
    cy.wait(100);

    cy.get("#search-ranking").click();
    cy.get("#personal-information-title").should('have.text', `Información personal`); 
  });
  it('go to create incident user not exist', () => {
    cy.visit('/');
    const username = "sa";
    const password= "123456";
    cy.get("#txt-username").type(username);
    cy.get("#txt-password").type(password);
    cy.get("#btn-signin").click();
    cy.wait(100);

    const identityNumber = '00000000'
    cy.get("#incident-dashboard").click();
    cy.wait(200);
  
    cy.get('#identity-number').type(identityNumber, { force: true });
    cy.wait(100);

    cy.get('#identity-type').click();
    cy.wait(100);

    cy.get('mat-option[value="Cédula_Cuidadania"]').click();
    cy.wait(100);

    cy.get("#search-ranking").click();
    cy.wait(100);

    cy.get("#incident-detail-title").should('have.text', `Datos de tu incidencia`); 
  });
  it('go to create incident by ranking', () => {
    cy.visit('/');
    const username = "sa";
    const password= "123456";
    cy.get("#txt-username").type(username);
    cy.get("#txt-password").type(password);
    cy.get("#btn-signin").click();
    cy.wait(100);

    const identityNumber = '1030661927'
    cy.get("#incident-dashboard").click();
    cy.wait(200);
  
    cy.get('#identity-number').type(identityNumber, { force: true });
    cy.wait(100);

    cy.get('#identity-type').click();
    cy.wait(100);

    cy.get('mat-option[value="Cédula_Cuidadania"]').click();
    cy.wait(100);

    cy.get("#search-ranking").click();
    cy.wait(100);

    cy.get("#create-incident-button").click();
    cy.wait(100);

    cy.get("#incident-detail-title").should('have.text', `Datos de tu incidencia`); 
  });
  it('create incident by ranking', () => {
    cy.visit('/');
    const username = "sa";
    const password= "123456";
    cy.get("#txt-username").type(username);
    cy.get("#txt-password").type(password);
    cy.get("#btn-signin").click();
    cy.wait(100);

    const identityNumber = '1030661927'
    cy.get("#incident-dashboard").click();
    cy.wait(200);
  
    cy.get('#identity-number').type(identityNumber, { force: true });
    cy.wait(100);

    cy.get('#identity-type').click();
    cy.wait(100);

    cy.get('mat-option[value="Cédula_Cuidadania"]').click();
    cy.wait(100);

    cy.get("#search-ranking").click();
    cy.wait(100);

    cy.get("#create-incident-button").click();
    cy.wait(100);

    cy.get('#tipo-incidencia').click();
    cy.wait(100);

    cy.get('mat-option[value="Sugerencia"]').click();
    cy.wait(100);

    cy.get('#canal-incidencia').click();
    cy.wait(100);

    cy.get('mat-option[value="Correo Electrónico"]').click();
    cy.wait(100);

    cy.get('#asunto_incidencia').type('asunto incidencia cypress', { force: true });
    cy.wait(100);

    cy.get('#detalle_incidencia').type('Detalle incidencia cypress', { force: true });
    cy.wait(100);

    cy.get("#save-incident").click();
    cy.wait(100);
  });
  it('go back from create incident to ranking', () => {
    cy.visit('/');
    const username = "sa";
    const password= "123456";
    cy.get("#txt-username").type(username);
    cy.get("#txt-password").type(password);
    cy.get("#btn-signin").click();
    cy.wait(100);

    const identityNumber = '1030661927'
    cy.get("#incident-dashboard").click();
    cy.wait(200);
  
    cy.get('#identity-number').type(identityNumber, { force: true });
    cy.wait(100);

    cy.get('#identity-type').click();
    cy.wait(100);

    cy.get('mat-option[value="Cédula_Cuidadania"]').click();
    cy.wait(100);

    cy.get("#search-ranking").click();
    cy.wait(100);

    cy.get("#create-incident-button").click();
    cy.wait(100);

    cy.get("#go-back").click();
    cy.wait(100);
  });
})
