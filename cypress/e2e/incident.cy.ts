describe('user query form', () => {
  it('Login success', () => {
    // login del usuario exitoso
    cy.visit('/');
     const username = "meli-agent";
    const password= "Meli2024@";
    cy.get("#txt-username").type(username);
    cy.get("#txt-password").type(password);
    cy.get("#btn-signin").click();
    cy.wait(100);

    // menu
    cy.get("#incident-dashboard").click();
    cy.wait(100);

    cy.get("#report-incident-button").click();
    cy.wait(100);

    cy.get("#user-query-title").should('have.text', `Consulta datos del usuario`); 

  });
  it('go to create incident user not exist', () => {
    cy.visit('/');
     const username = "meli-agent";
    const password= "Meli2024@";
    cy.get("#txt-username").type(username);
    cy.get("#txt-password").type(password);
    cy.get("#btn-signin").click();
    cy.wait(100);

    const identityNumber = '00000000'
    cy.get("#incident-dashboard").click();
    cy.wait(200);

    cy.get("#report-incident-button").click();
    cy.wait(100);
  
    cy.get('#identity-number').type(identityNumber, { force: true });
    cy.wait(100);

    cy.get('#identity-type').click();
    cy.wait(100);

    cy.get('mat-option[value="1"]').click();
    cy.wait(100);

    cy.get("#search-ranking").click();
    cy.wait(100);

    cy.get("#incident-detail-title").should('have.text', `Datos de tu incidencia`); 
  });
  it('create incident user not exist', () => {
    cy.visit('/');
     const username = "meli-agent";
    const password= "Meli2024@";
    cy.get("#txt-username").type(username);
    cy.get("#txt-password").type(password);
    cy.get("#btn-signin").click();
    cy.wait(100);

    const identityNumber = '00000000'
    cy.get("#incident-dashboard").click();
    cy.wait(200);

    cy.get("#report-incident-button").click();
    cy.wait(100);
  
    cy.get('#identity-number').type(identityNumber, { force: true });
    cy.wait(100);

    cy.get('#identity-type').click();
    cy.wait(100);

    cy.get('mat-option[value="1"]').click();
    cy.wait(100);

    cy.get("#search-ranking").click();
    cy.wait(100);

    cy.get('#name-person').type('test', { force: true });
    cy.wait(100);

    cy.get('#lastname-person').type('test', { force: true });
    cy.wait(100);

    cy.get('#email-person').type('test@hotmail.com', { force: true });
    cy.wait(100);

    cy.get('#email-person').type('test@hotmail.com', { force: true });
    cy.wait(100);

    cy.get('#identity-type-person').click();
    cy.wait(100);

    cy.get('mat-option[value="1"]').click();
    cy.wait(100);

    cy.get('#identity-number-person').type('00000000', { force: true });
    cy.wait(100);

    cy.get('#cellphone-person').type('3142980620', { force: true });
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
  it('go to ranking success', () => {
    cy.visit('/');
     const username = "meli-agent";
    const password= "Meli2024@";
    cy.get("#txt-username").type(username);
    cy.get("#txt-password").type(password);
    cy.get("#btn-signin").click();
    cy.wait(100);

    const identityNumber = '1030661927'
    cy.get("#incident-dashboard").click();
    cy.wait(100);

    cy.get("#report-incident-button").click();
    cy.wait(100);
  
    cy.get('#identity-number').type(identityNumber, { force: true });

    cy.get('#identity-type').click();
    cy.wait(100);

    cy.get('mat-option[value="1"]').click();
    cy.wait(100);

    cy.get("#search-ranking").click();
    cy.get("#personal-information-title").should('have.text', `Información personal`); 
  });
  it('go to create incident by ranking', () => {
    cy.visit('/');
     const username = "meli-agent";
    const password= "Meli2024@";
    cy.get("#txt-username").type(username);
    cy.get("#txt-password").type(password);
    cy.get("#btn-signin").click();
    cy.wait(100);

    const identityNumber = '1030661927'
    cy.get("#incident-dashboard").click();
    cy.wait(200);

    cy.get("#report-incident-button").click();
    cy.wait(100);
  
    cy.get('#identity-number').type(identityNumber, { force: true });
    cy.wait(100);

    cy.get('#identity-type').click();
    cy.wait(100);

    cy.get('mat-option[value="1"]').click();
    cy.wait(100);

    cy.get("#search-ranking").click();
    cy.wait(100);

    cy.get("#create-incident-button").click();
    cy.wait(100);

    cy.get("#incident-detail-title").should('have.text', `Datos de tu incidencia`); 
  });
  
  it('create incident by ranking', () => {
    cy.visit('/');
     const username = "meli-agent";
    const password= "Meli2024@";
    cy.get("#txt-username").type(username);
    cy.get("#txt-password").type(password);
    cy.get("#btn-signin").click();
    cy.wait(100);

    const identityNumber = '1030661927'
    cy.get("#incident-dashboard").click();
    cy.wait(200);

    cy.get("#report-incident-button").click();
    cy.wait(100);
  
    cy.get('#identity-number').type(identityNumber, { force: true });
    cy.wait(100);

    cy.get('#identity-type').click();
    cy.wait(100);

    cy.get('mat-option[value="1"]').click();
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
     const username = "meli-agent";
    const password= "Meli2024@";
    cy.get("#txt-username").type(username);
    cy.get("#txt-password").type(password);
    cy.get("#btn-signin").click();
    cy.wait(100);

    const identityNumber = '1030661927'
    cy.get("#incident-dashboard").click();
    cy.wait(200);

    cy.get("#report-incident-button").click();
    cy.wait(100);
  
    cy.get('#identity-number').type(identityNumber, { force: true });
    cy.wait(100);

    cy.get('#identity-type').click();
    cy.wait(100);

    cy.get('mat-option[value="1"]').click();
    cy.wait(100);

    cy.get("#search-ranking").click();
    cy.wait(100);

    cy.get("#create-incident-button").click();
    cy.wait(100);

    cy.get("#go-back").click();
    cy.wait(100);
  });
  it('go to incident list clean filter', () => {
    cy.visit('/');
     const username = "meli-agent";
    const password= "Meli2024@";
    cy.get("#txt-username").type(username);
    cy.get("#txt-password").type(password);
    cy.get("#btn-signin").click();
    cy.wait(100);

    const identityNumber = '1030661927'
    cy.get("#incident-dashboard").click();
    cy.wait(100);
  
    cy.get('#incident-identifies').type(identityNumber, { force: true });
    cy.wait(100);

    cy.get('#identity-number-client').type(identityNumber, { force: true });
    cy.wait(100);

    cy.get('#status-incident-person').click();
    cy.wait(100);

    cy.get('mat-option[value="1"]').click();
    cy.wait(100);

    cy.get("#clear-filter").click();
  });
  it('go to incident list filter and detail', () => {
    cy.visit('/');
     const username = "meli-agent";
    const password= "Meli2024@";
    cy.get("#txt-username").type(username);
    cy.get("#txt-password").type(password);
    cy.get("#btn-signin").click();
    cy.wait(100);

    const identityNumber = '1030661927'
    cy.get("#incident-dashboard").click();
    cy.wait(100);
  
    cy.get('#identity-number-client').type(identityNumber, { force: true });
    cy.wait(100);

    cy.get("#filter").click();
    cy.wait(100);

    cy.get('table tbody tr').first().find('#detail-incident').click();
    cy.wait(100);

    cy.get("#comments-panel").click();
    cy.wait(100);
  });
  it('go to incident list detail and manage indcident', () => {
    cy.visit('/');
     const username = "meli-agent";
    const password= "Meli2024@";
    cy.get("#txt-username").type(username);
    cy.get("#txt-password").type(password);
    cy.get("#btn-signin").click();
    cy.wait(100);

    const identityNumber = '1030661927'
    cy.get("#incident-dashboard").click();
    cy.wait(100);
  
    cy.get('#identity-number-client').type(identityNumber, { force: true });
    cy.wait(100);

    cy.get("#filter").click();
    cy.wait(100);

    cy.get('table tbody tr').first().find('#detail-incident').click();
    cy.wait(100);

    cy.get("#manage-incident").click();
    cy.wait(100);

    cy.get('#status-incident-managment').click();
    cy.wait(100);

    cy.get('mat-option[value="5"]').click();
    cy.wait(100);

    cy.get('#detalle_incidencia_dialog').type('Este es el comentario de la incidencias', { force: true });
    cy.wait(100);

    cy.get('#update-incident').click();
    cy.wait(100);
    
  });
})
