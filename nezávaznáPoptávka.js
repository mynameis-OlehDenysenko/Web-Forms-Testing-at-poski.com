const generateData = require('./generateData')

const {
  fillInput
} = require('./helpers')

describe('validate contact form', () => {

  let data

  beforeEach(() => {

    data = generateData()

    cy.visit('/')

    cy.get('.btn').first().click()

  })

  it('should valid form submit', () => {

    cy.get('#jmeno-prijmeni')
      .type(data.validName)

    cy.get('#telefon')
      .type(data.validPhoneNumber)

    cy.get('#email')
      .type(data.validEmail)

    cy.get('#nazev-spolecnosti')
      .type(data.companyName)

    cy.get('#message')
      .type(data.paragraph)

    cy.get('#submit')
      .click()

    cy.get('.column>p')
      .should('have.class', 'success')
  })

  it('should not accept empty form', () => {

    cy.get('#submit')
      .click()

    cy.get('.column>p.success')
      .should('not.exist')

  })

  it('should not accept invalid data', () => {

    cy.get('#jmeno-prijmeni')
      .type(data.invalidName)

    cy.get('#telefon')
      .type(data.invalidPhoneNumber)

    cy.get('#email')
      .type(data.invalidEmail)

    cy.get('#submit')
      .click()

    cy.get('.column>p.success')
      .should('not.exist')
  })

})

describe('validate inputs in form', () => {

  let data

  beforeEach(() => {
    data = generateData()
    cy.visit('/')
    const nezavaznaPoptavkaBtn = cy.get('.btn').first()
    nezavaznaPoptavkaBtn.click()
  })

  it('should validate URL', () => {
    cy.url()
      .should('include', '/nezavazna-schuzka')
  })

  it('should validate label', () => {

    cy.get('.column>h2')
      .first()
      .should('contain', 'Vyplnit nezávazný formulář je prvním krokem k úspěchu.')

  })

  it('should validate dropdown menu', () => {

    const mamZajemDropdown = ['Realitní systém Poski REAL', 'Poski Webdesign', 'E-shop Clevero', 'Online marketing', 'Školení na míru', 'Partnerství', 'Jiné']

    for (let i = 1; i < 8; i++) {

      cy.get('.ui-selectmenu-text').eq(0).click()
      cy.get(`#ui-id-${i}`).click().should('contain', mamZajemDropdown[i - 1])

    }

  })

  it('should validate dropdown by keypress', () => {

    const mamZajemDropdown = [
      'Realitní systém Poski REAL', 
      'Poski Webdesign', 
      'E-shop Clevero', 
      'Online marketing', 
      'Školení na míru', 
      'Partnerství', 
      'Jiné'
  ]

    cy.get('.ui-selectmenu-text')
      .should('contain', 'Realitní systém Poski REAL')

      for (let i = 1; i < 8; i++) {

        cy.get('.ui-selectmenu-text').eq(0).type('{downarrow}{enter}')
        cy.get(`#ui-id-${i}`).should('contain', mamZajemDropdown[i - 1])
  
      }
  })

  it('should validate jmeno a prijmeni', () => {

    fillInput('#jmeno-prijmeni', data.validName)
    cy.get('#jmeno-prijmeni').should('have.class', 'ui-state-valid')

  })

  it('should error on invalid name', () => {

    fillInput('#jmeno-prijmeni', data.invalidName)
    cy.get('#jmeno-prijmeni').should('have.class', 'ui-state-error')

  })

  it('should validate telefon', () => {

    fillInput('#telefon', data.validPhoneNumber)
    cy.get('#telefon').should('have.class', 'ui-state-valid')

  })

  it('should error on invalid telefon', () => {

    fillInput('#telefon', data.invalidPhoneNumber)
    cy.get('#telefon').should('have.class', 'ui-state-invalid')

  })

  it('should validate email', () => {
    const listOfValidEmails = [
      'abc-d@mail.com',
      'abc.def@mail.com',
      'abc@mail.com',
      'abc_def@mail.com',
      'abc.def@mail.cc',
      'abc.def@mail-archive.com',
      'abc.def@mail.org'
    ]
    for (const i in listOfValidEmails){
      cy.get('#email').type(listOfValidEmails[i]).blur()

      cy.get('#email').should('have.class', 'ui-state-valid')

      cy.get('#email').clear()
    }
  })

  it('should error on invalid email', () => {

    const listOfInvalidEmails = [
      'abc-@mail.com',
      'abc..def@mail.com',
      '.abc@mail.com',
      'abc#def@mail.com',
      'abc.def@mail.c',
      'abc.def@mail#archive.com',
      'abc.def@mail',
      'abc.def@mail..com'
    ]

    for (const i in listOfInvalidEmails){
      cy.get('#email').type(listOfInvalidEmails[i]).blur()

      cy.get('#email').should('have.class', 'ui-state-error')

      cy.get('#email').clear()
    }

  })

  it('should validate nazev spolecnosti', () => {

    fillInput('#nazev-spolecnosti', data.companyName)
    cy.get('#nazev-spolecnosti').should('have.class', 'ui-state-valid')

  })

  it('should validate message', () => {

    fillInput('#message', data.paragraph)
    cy.get('#message').should('have.class', 'ui-state-valid')

  })

  it('should validate podmínky ochrany osobních údajů link', () => {
    cy.get('a[href="/zpracovani-osobnich-udaju"]')
      .should('have.attr', 'target', '_blank')
  })

})