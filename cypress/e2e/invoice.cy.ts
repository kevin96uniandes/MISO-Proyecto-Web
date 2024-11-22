describe('invoice form', () => { 
    it('open invoice', () => {
        // login del usuario exitoso
        cy.visit('/');
         const username = "sprint3";
        const password= "Sprint3@";
        cy.get("#txt-username").type(username);
        cy.get("#txt-password").type(password);
        cy.get("#btn-signin").click();
        cy.wait(100);
    
        // menu
        cy.get("#invoice-dashboard").click();
        cy.wait(200);
      });
      it('select currency an generate invoice', () => {
        // login del usuario exitoso
        cy.visit('/');
         const username = "sprint3";
        const password= "Sprint3@";
        cy.get("#txt-username").type(username);
        cy.get("#txt-password").type(password);
        cy.get("#btn-signin").click();
        cy.wait(300);
    
        // menu
        cy.get("#invoice-dashboard").click();
        cy.wait(300);

        cy.get('#select-currency').click();
        cy.wait(300);

        cy.get('mat-option[value="USD"]').click();
        cy.wait(100);

      });
      it('select other month an generate invoice', () => {
        // login del usuario exitoso
        cy.visit('/');
         const username = "sprint3";
        const password= "Sprint3@";
        cy.get("#txt-username").type(username);
        cy.get("#txt-password").type(password);
        cy.get("#btn-signin").click();
        cy.wait(100);
    
        // menu
        cy.get("#invoice-dashboard").click();
        cy.wait(300);

        cy.get('#select-month').click();
        cy.wait(300);

        cy.get('mat-option[value="10"]').click();
        cy.wait(300);

        cy.get("#generate-invoice").click();
        cy.wait(100);
      });
      it('download invoice generate invoice pdf', () => {
        // login del usuario exitoso
        cy.visit('/');
        const username = "sprint3";
        const password= "Sprint3@";
        cy.get("#txt-username").type(username);
        cy.get("#txt-password").type(password);
        cy.get("#btn-signin").click();
        cy.wait(100);
    
        // menu
        cy.get("#invoice-dashboard").click();
        cy.wait(300);

        cy.get('#select-month').click();
        cy.wait(500);

        cy.get('mat-option[value="10"]').click();
        cy.wait(300);

        cy.get("#generate-invoice").click();
        cy.wait(300);

        cy.get("#download-pdf").click();
        cy.wait(300);
      });
      it('send invoice by email', () => {
        // login del usuario exitoso
        cy.visit('/');
        const username = "sprint3";
        const password= "Sprint3@";
        cy.get("#txt-username").type(username);
        cy.get("#txt-password").type(password);
        cy.get("#btn-signin").click();
        cy.wait(100);
    
        // menu
        cy.get("#invoice-dashboard").click();
        cy.wait(300);

        cy.get("#send-email-invoice").click();
        cy.wait(300);

        cy.get('#invoiceEmail').type("test@test.com", { force: true });
        cy.wait(300);

        cy.get("#send-email-dialog").click();
        cy.wait(300);
      });
      it('payment invoice', () => {
        // login del usuario exitoso
        cy.visit('/');
        const username = "sprint3";
        const password= "Sprint3@";
        cy.get("#txt-username").type(username);
        cy.get("#txt-password").type(password);
        cy.get("#btn-signin").click();
        cy.wait(100);
    
        // menu
        cy.get("#invoice-dashboard").click();
        cy.wait(300);

        cy.get("#send-email-invoice").click();
        cy.wait(300);

        cy.get('#invoiceEmail').type("test@test.com", { force: true });
        cy.wait(300);

        cy.get("#send-email-dialog").click();
        cy.wait(300);
      });
      it('payment invoice', () => {
        // login del usuario exitoso
        cy.visit('/');
        const username = "sprint3";
        const password= "Sprint3@";
        cy.get("#txt-username").type(username);
        cy.get("#txt-password").type(password);
        cy.get("#btn-signin").click();
        cy.wait(100);
    
        // menu
        cy.get("#invoice-dashboard").click();
        cy.wait(300);

        cy.get('#select-month').click();
        cy.wait(300);

        cy.get('mat-option[value="9"]').click();
        cy.wait(300);

        cy.get("#generate-invoice").click();
        cy.wait(500);

        cy.get("#pay-invoice").click();
        cy.wait(300);

        cy.get('#credit-card-number').type("123456789", { force: true });
        cy.wait(300);

        cy.get('#owner-name').type("test test test", { force: true });
        cy.wait(300);

        cy.get('#expiration-date').type("10/29", { force: true });
        cy.wait(300);

        cy.get('#cvv').type("123", { force: true });
        cy.wait(300);

        cy.get("#make-payment").click();
        cy.wait(300);
      });
});