describe('Pruebas de Registro de Agente', () => {
  it('Debería mostrar todos los campos del formulario de inicio de sesión', () => {
    cy.visit('/');
    cy.get('#txt-username').should('be.visible');
    cy.get('#txt-password').should('be.visible');
    cy.get('#btn-signin').should('be.visible');
    cy.get('button').contains('REGISTRARSE').should('be.visible');
  });

  it('Debería navegar al formulario de registro de cliente al hacer clic en el botón de "REGISTRARSE"', () => {
    cy.visit('/');
    cy.get('button').contains('REGISTRARSE').click();
    cy.url().should('include', '/register/client');
    cy.get('form#register-client').should('be.visible');
  });

  it('Debería mostrar todos los campos del formulario de registro', () => {
    cy.visit('/');
    cy.get('button').contains('REGISTRARSE').click();
    cy.get('#nombre_empresa').should('be.visible');
    cy.get('#email').should('be.visible');
    cy.get('#tipo_documento').should('be.visible');
    cy.get('#numero_identificacion').should('be.visible');
    cy.get('#sector').should('be.visible');
    cy.get('#telefono').should('be.visible');
    cy.get('#pais').should('be.visible');
    cy.get('#usuario').should('be.visible');
    cy.get('#contrasena').should('be.visible');
    cy.get('#confirmar_contrasena').should('be.visible');
  });

  it('Debería mostrar mensajes de error si los campos están vacíos', () => {
    cy.visit('/');
    cy.get('button').contains('REGISTRARSE').click();
    cy.get('form#register-client').submit();
    cy.get('#nombre_empresa').click({ force: true });
    cy.get('body').click();
    cy.get('#mat-mdc-error-2').contains('Campo requerido').should('be.visible');
  });

  it('Debería permitir el registro de un cliente con datos válidos', () => {
    cy.visit('/');
    cy.get('button').contains('REGISTRARSE').click();
    cy.get('#nombre_empresa').should('be.visible').type('Mi Empresa', { force: true });
    cy.get('#email').should('be.visible').type('correo@ejemplo.com', { force: true });
    cy.get('#tipo_documento').click({ force: true });
    cy.get('mat-option').contains('Cédula de ciudadanía').click({ force: true });
    cy.get('#numero_identificacion').should('be.visible').type('123456789', { force: true });
    cy.get('#sector').should('be.visible').type('Tecnología', { force: true });
    cy.get('#telefono').should('be.visible').type('3001234567', { force: true });
    cy.get('#pais').should('be.visible').type('Colombia', { force: true });
    cy.get('#usuario').should('be.visible').type('usuario_prueba', { force: true });
    cy.get('#contrasena').should('be.visible').type('Password123!', { force: true });
    cy.get('#confirmar_contrasena').should('be.visible').type('Password123!', { force: true });
    cy.get('button').contains('Registrar').should('be.visible');
    cy.get('form#register-client').submit();
  });

});
