describe('Plan Selection', () => {
  beforeEach(() => {
    cy.visit('/');
    const username = "luisa";
    const password= "Prueba123";
    cy.get("#txt-username").type(username);
    cy.get("#txt-password").type(password);
    cy.get("#btn-signin").click();
    cy.wait(100);
    cy.get("#plans-dashboard").click();
  });

  it('Should open confirmation modal when a plan is selected', () => {
    cy.get('button').contains('OBTENER').first().click();
    cy.get('mat-dialog-container').should('be.visible');
    cy.get('mat-dialog-container').contains('Plan Emprendedor').should('exist');
  });

  it('Should update the price when the currency is changed', () => {
    cy.get('mat-select').click();
    cy.get('mat-option').each(($el) => {
      cy.wrap($el).invoke('text').then((text) => {
        if (text.trim() === 'UNITED_STATES_DOLLAR') {
          cy.wrap($el).click();
        }
      });
    });
  });

  it('Should display "ACTIVE" tag for active plans', () => {
    cy.get('#active-tag').should('be.visible');
  });

  it('Should not allow selecting another plan if one is already active', () => {
    cy.get('#active-tag').should('exist');
    cy.wait(1000);
    cy.get('button').contains('OBTENER').should('not.be.visible');
  });

  it('Should display the correct features for each plan', () => {
    cy.get('mat-grid-tile').should('be.visible');
  });

});
