describe('Check if game cells are clickable and outputs correctly.', () => {
  it('plays a PvP game that makes sure all cells are clickable.', () => {
    cy.visit('http://localhost:1234');
    cy.get('#c1').click();
    cy.get('#c1').should(($element) => {
      expect($element.html()).to.eq('X');
    });
    cy.get('#c5').click();
    cy.get('#c5').should(($element) => {
      expect($element.html()).to.eq('O');
    });
    cy.get('#c9').click();
    cy.get('#c9').should(($element) => {
      expect($element.html()).to.eq('X');
    });
    cy.get('#c6').click();
    cy.get('#c6').should(($element) => {
      expect($element.html()).to.eq('O');
    });
    cy.get('#c4').click();
    cy.get('#c4').should(($element) => {
      expect($element.html()).to.eq('X');
    });
    cy.get('#c7').click();
    cy.get('#c7').should(($element) => {
      expect($element.html()).to.eq('O');
    });
    cy.get('#c8').click();
    cy.get('#c8').should(($element) => {
      expect($element.html()).to.eq('X');
    });
    cy.get('#c2').click();
    cy.get('#c2').should(($element) => {
      expect($element.html()).to.eq('O');
    });
    cy.get('#c3').click();
    cy.get('#c3').should(($element) => {
      expect($element.html()).to.eq('X');
    });
  });
});

describe('Check if game cells are reset correctly when game is reset.', () => {
  it('plays a PvP game that fills all cells and resets all cells properly.', () => {
    cy.visit('http://localhost:1234');
    cy.get('#c1').click();
    cy.get('#c1').should(($element) => {
      expect($element.html()).to.eq('X');
    });
    cy.get('#c5').click();
    cy.get('#c5').should(($element) => {
      expect($element.html()).to.eq('O');
    });
    cy.get('#c9').click();
    cy.get('#c9').should(($element) => {
      expect($element.html()).to.eq('X');
    });
    cy.get('#c6').click();
    cy.get('#c6').should(($element) => {
      expect($element.html()).to.eq('O');
    });
    cy.get('#c4').click();
    cy.get('#c4').should(($element) => {
      expect($element.html()).to.eq('X');
    });
    cy.get('#c7').click();
    cy.get('#c7').should(($element) => {
      expect($element.html()).to.eq('O');
    });
    cy.get('#c8').click();
    cy.get('#c8').should(($element) => {
      expect($element.html()).to.eq('X');
    });
    cy.get('#c2').click();
    cy.get('#c2').should(($element) => {
      expect($element.html()).to.eq('O');
    });
    cy.get('#c3').click();
    cy.get('#c3').should(($element) => {
      expect($element.html()).to.eq('X');
    });
    cy.contains('Play again').click();
    cy.get('#c1').should(($element) => {
      expect($element.html()).to.eq('');
    });
    cy.get('#c2').should(($element) => {
      expect($element.html()).to.eq('');
    });
    cy.get('#c3').should(($element) => {
      expect($element.html()).to.eq('');
    });
    cy.get('#c4').should(($element) => {
      expect($element.html()).to.eq('');
    });
    cy.get('#c5').should(($element) => {
      expect($element.html()).to.eq('');
    });
    cy.get('#c6').should(($element) => {
      expect($element.html()).to.eq('');
    });
    cy.get('#c7').should(($element) => {
      expect($element.html()).to.eq('');
    });
    cy.get('#c8').should(($element) => {
      expect($element.html()).to.eq('');
    });
    cy.get('#c9').should(($element) => {
      expect($element.html()).to.eq('');
    });
  });
});

describe('Check if game state is correct when a player wins.', () => {
  it('simulates a PvP game with a winner, and checks if game history is correctly added.', () => {
    cy.visit('http://localhost:1234');
    cy.get('#c1').click();
    cy.get('#c1').should(($element) => {
      expect($element.html()).to.eq('X');
    });
    cy.get('#c5').click();
    cy.get('#c5').should(($element) => {
      expect($element.html()).to.eq('O');
    });
    cy.get('#c4').click();
    cy.get('#c4').should(($element) => {
      expect($element.html()).to.eq('X');
    });
    cy.get('#c6').click();
    cy.get('#c6').should(($element) => {
      expect($element.html()).to.eq('O');
    });
    cy.get('#c7').click();
    cy.get('#c7').should(($element) => {
      expect($element.html()).to.eq('X');
    });
    cy.contains('h3', 'Game 1: X won.').should('be.visible').click();
    cy.contains('h3', 'Game 1: X won.')
      .parent().parent() 
      .find('ol')
      .should('be.visible')
      .within(() => {
        cy.contains('li', 'Xc1');
        cy.contains('li', 'Oc5');
        cy.contains('li', 'Xc4');
        cy.contains('li', 'Oc6');
        cy.contains('li', 'Xc7');
      });
  });
});

describe('Check if a game is added to game history properly.', () => {
  it('plays a PvP game and checks if a game has been added to history.', () => {
    cy.visit('http://localhost:1234');
    cy.get('#c1').click();
    cy.get('#c1').should(($element) => {
      expect($element.html()).to.eq('X');
    });
    cy.get('#c5').click();
    cy.get('#c5').should(($element) => {
      expect($element.html()).to.eq('O');
    });
    cy.get('#c9').click();
    cy.get('#c9').should(($element) => {
      expect($element.html()).to.eq('X');
    });
    cy.get('#c6').click();
    cy.get('#c6').should(($element) => {
      expect($element.html()).to.eq('O');
    });
    cy.get('#c4').click();
    cy.get('#c4').should(($element) => {
      expect($element.html()).to.eq('X');
    });
    cy.get('#c7').click();
    cy.get('#c7').should(($element) => {
      expect($element.html()).to.eq('O');
    });
    cy.get('#c8').click();
    cy.get('#c8').should(($element) => {
      expect($element.html()).to.eq('X');
    });
    cy.get('#c2').click();
    cy.get('#c2').should(($element) => {
      expect($element.html()).to.eq('O');
    });
    cy.get('#c3').click();
    cy.get('#c3').should(($element) => {
      expect($element.html()).to.eq('X');
    });
    cy.contains('h3', 'Game 1: No one won.').should('be.visible').click();
    cy.contains('h3', 'Game 1: No one won.')
      .parent().parent() 
      .find('ol')
      .should('be.visible')
      .within(() => {
        cy.contains('li', 'Xc1');
        cy.contains('li', 'Oc5');
        cy.contains('li', 'Xc9');
        cy.contains('li', 'Oc6');
        cy.contains('li', 'Xc4');
        cy.contains('li', 'Oc7');
        cy.contains('li', 'Xc8');
        cy.contains('li', 'Oc2');
        cy.contains('li', 'Xc3');
      });
  });
});

describe('Check if game state persists.', () => {
  it('plays a PvP game, refreshes the page during the game and checks whether state is the same.', () => {
    cy.visit('http://localhost:1234');
    cy.get('#c1').click();
    cy.get('#c1').should(($element) => {
      expect($element.html()).to.eq('X');
    });
    cy.get('#c5').click();
    cy.get('#c5').should(($element) => {
      expect($element.html()).to.eq('O');
    });
    cy.reload();
    cy.get('#c1').should(($element) => {
      expect($element.html()).to.eq('X');
    });
    cy.get('#c5').should(($element) => {
      expect($element.html()).to.eq('O');
    });
  });
});


