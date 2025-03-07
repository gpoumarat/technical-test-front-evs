describe('Exam Management Workflow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should navigate to exam list by default', () => {
    cy.url().should('include', '/exams');
    cy.get('h2').should('contain', 'Liste des examens');
  });

  it('should create a new exam successfully', () => {
    // Navigate to new exam form
    cy.get('[data-cy="new-exam-button"]').click();
    cy.url().should('include', '/new-exam');

    // Fill the form
    cy.get('#firstName').type('John');
    cy.get('#lastName').type('Doe');
    cy.get('#meetingPoint').type('Paris');
    cy.get('#examDate').type('2024-01-01');
    cy.get('#examTime').type('10:00');
    cy.get('#status').select('A organiser');

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Verify success message and redirection
    cy.get('.bg-green-100').should('be.visible')
      .and('contain', 'Examen ajouté avec succès');
    cy.url().should('include', '/exams');

    // Verify new exam appears in the list with the properly formatted date
    cy.get('[data-cy="exam-list"]')
      .should('contain', 'John Doe')
      .and('contain', 'Paris')
      .and('contain', '1 janvier') 
      .and('contain', '10 h');  
  });

  it('should show validation errors', () => {
    cy.visit('/new-exam');

    // Try to submit empty form
    cy.get('button[type="submit"]').click();

    // Verify validation messages
    cy.get('.text-red-600').should('be.visible');
    cy.contains('Le prénom est requis').should('be.visible');
    cy.contains('Le nom est requis').should('be.visible');
    cy.contains('Le point de rendez-vous est requis').should('be.visible');
    cy.contains('La date est requise').should('be.visible');
    cy.contains("L'heure est requise").should('be.visible');
  });

  it('should handle server errors gracefully', () => {
    // Intercept API calls and force an error
    cy.intercept('POST', '/api/exams', {
      statusCode: 500,
      body: { message: 'Server error' }
    }).as('createExam');

    cy.visit('/new-exam');

    // Fill and submit form
    cy.get('#firstName').type('John');
    cy.get('#lastName').type('Doe');
    cy.get('#meetingPoint').type('Paris');
    cy.get('#examDate').type('2024-01-01');
    cy.get('#examTime').type('10:00');
    cy.get('#status').select('A organiser');
    cy.get('button[type="submit"]').click();

    // Verify error handling
    cy.wait('@createExam');
    cy.get('.bg-red-100').should('be.visible')
      .and('contain', "Erreur lors de l'ajout de l'examen");
  });
});