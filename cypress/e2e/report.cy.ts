describe('Incidents Dashboard', () => {
  beforeEach(() => {
    cy.visit('/');
    const username = "pruebacliente";
    const password= "Prueba123";
    cy.get("#txt-username").type(username);
    cy.get("#txt-password").type(password);
    cy.get("#btn-signin").click();
    cy.wait(500);
    cy.get("#report-dashboard").click();
  });

  it('Debe cargar el formulario correctamente', () => {
    cy.get('h4').should('contain', 'Crear reporte');
    cy.get('#nombre_reporte').should('exist');
    cy.get('mat-form-field').should('have.length', 7);
  });

  it('Debe mostrar error si no se completa el nombre del reporte', () => {
    cy.get('.button-create').click();
    cy.get('h4').should('contain', 'Crear reporte');
  });

  it('Debe permitir limpiar los filtros', () => {
    cy.get('#nombre_reporte').type('Reporte de prueba', { force: true });
    cy.get('.button-clean').click();
    cy.get('#nombre_reporte').should('have.value', '');
  });

  it('Debe mostrar mensaje de éxito al guardar un reporte válido', () => {
    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen');
    });

    cy.get('#nombre_reporte').type('Reporte de prueba', { force: true });
    cy.get('#status').click();
    cy.get('mat-option').contains('Abierto').click();

    cy.get('.button-create').click();

    cy.get('@windowOpen').should('have.been.calledOnce');
  });

  it('Debe manejar errores al guardar un reporte', () => {
    cy.intercept('POST', '/report/generate', { statusCode: 500 }).as('saveReport');

    cy.get('#nombre_reporte').type('Reporte de prueba', { force: true });
    cy.get('.button-create').click();

    cy.wait('@saveReport');
    cy.get('#mat-snack-bar-container-live-0 > div > simple-snack-bar > div.mat-mdc-snack-bar-label.mdc-snackbar__label')
      .should('contain', 'Error al guardar el reporte. Por favor intenta nuevamente.')
      .should('be.visible');
  });

  it('Debe abrir un archivo al guardar un reporte exitosamente', () => {
    const blobUrl = 'blob:http://localhost/somefile';
    cy.intercept('POST', '/report/generate', {
      statusCode: 200,
      body: new Blob(['Reporte generado']),
      headers: { 'Content-Type': 'application/octet-stream' },
    }).as('saveReport');

    cy.get('#nombre_reporte').type('Reporte de prueba', { force: true });
    cy.get('.button-create').click();

    cy.wait('@saveReport');
    cy.get('#mat-snack-bar-container-live-0 > div > simple-snack-bar > div.mat-mdc-snack-bar-label.mdc-snackbar__label')
      .should('contain', 'Reporte guardado exitosamente.')
      .should('be.visible');
  });

  it('Debe enviar el correo', () => {
    cy.get('#nombre_reporte').type('Reporte de prueba', { force: true });
    cy.get('.button-email').click();
    cy.get('#email').type('hanna860@gmail.com', { force: true });
    cy.get('.button-send').click();
    cy.wait(500);
    cy.get('.button-email')
      .should('contain', 'ENVIAR POR CORREO')
      .should('be.visible');
  });
});
