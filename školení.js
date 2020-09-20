const generateData = require('./generateData')

const {
  fillInput
} = require('./helpers')

describe('validate contact form', () => {

  let data

  beforeEach(() => {

    data = generateData()

    cy.visit('/')

    cy.contains('Školení').click()

  })

  it('should valid form submit', () => {

    cy.get('#jmeno-prijmeni')
      .type(validName)

    cy.get('#email')
      .type(validEmail)

    cy.get('#telefon')
      .type(validPhoneNumber)

    cy.get('#submit')
      .click()

    cy.get('.form-container>.js-event-poptavka')
      .should('have.class', 'success')
  })

  it('should not accept empty form', () => {
    cy.get('#submit')
      .click()

    cy.get('.form-container>.js-event-poptavka')
      .should('not.exist')
  })

  it('should not accept invalid data', () => {

    cy.get('#jmeno-prijmeni')
      .type(invalidName)

    cy.get('#email')
      .type(invalidEmail)

    cy.get('#telefon')
      .type(invalidPhoneNumber)

    cy.get('#submit')
      .click()

    cy.get('.form-container>.js-event-poptavka')
      .should('have.class', 'success')
  })

})


describe('validate inputs in form', () => {

  let data

  beforeEach(() => {

    data = generateData()

    cy.visit('/')

    cy.contains('Školení').click()

  })

  it('should validate URL', () => {

    cy.url()
      .should('include', '/skoleni')

  })

  it('should redirect to contact form', () => {

    cy.contains('Školení e-mail marketingu: Jak oslovit lidi a získat co nejvíc?').click()
    cy.contains('Přihlásit se na školení').click()

    cy.get('#skoleniForm').should('be.visible')

  })

  it('should validate jmeno a prijmeni', () => {

    fillInput('#jmeno-prijmeni', data.validName)
    cy.get('#jmeno-prijmeni').should('have.class', 'ui-state-valid')

  })

  it('should error on invalid name', () => {

    fillInput('#jmeno-prijmeni', data.invalidName)
    cy.get('#jmeno-prijmeni').should('have.class', 'ui-state-error')

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

    for (const i in listOfValidEmails) {
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

    for (const i in listOfInvalidEmails) {
      cy.get('#email').type(listOfInvalidEmails[i]).blur()

      cy.get('#email').should('have.class', 'ui-state-error')

      cy.get('#email').clear()
    }

  })

  it('should validate telefon', () => {

    fillInput('#telefon', data.validPhoneNumber)
    cy.get('#telefon').should('have.class', 'ui-state-valid')

  })

  it('should error on invalid telefon', () => {

    fillInput('#telefon', data.invalidPhoneNumber)
    cy.get('#telefon').should('have.class', 'ui-state-invalid')

  })

  it('should validate MÁM ZÁJEM O dropdown', () => {

    const mamZajemDropdown = ['Školení online - Technické SEO  - 7.10.2020', 'Školení online - Facebook reklama pro začátečníky - 21.10.2020', 'Školení online - Facebook reklama pro pokročilé - 3.11.2020', 'Školení pro realitní makléře - Facebook pro pokročilé - 29.1.2021', 'Školení online - SEO - Jak být hvězdou vyhledávačů? - 11.2.2021', 'Školení online - SEO - Jak být hvězdou vyhledávačů? - 16.9.2021', 'Vlastní školení']

    for (let i = 1; i < 8; i++) {

      cy.get('.ui-selectmenu-text').eq(0).click()
      cy.get(`#ui-id-${i}`).click().should('contain', mamZajemDropdown[i - 1])

    }
  })

  it('should error on message', () => {

    fillInput('#message', data.paragraph)
    cy.get('#message').should('have.class', 'ui-state-valid')

  })

  it('should validate SLEVOVÁ KATEGORIE dropdown', () => {

    cy.get('.light-info')
      .should('contain', 'Slevy na školení nelze kombinovat. Uplatnění slevy podléhá schválení poskytovatele.')

    const slevovaKategorieDropdown = ['Bez slevy', 'Studenti (-50 %)', 'Klienti Poski.com (-20 %)', 'Opakovaní účastníci našich školení (-20 %)']

    for (let i = 1; i < 4; i++) {

      cy.get('.ui-selectmenu-text').eq(1).click()
      cy.get(`#ui-id-${i}`).click().should('contain', slevovaKategorieDropdown[i - 1])

    }

  })

  //TODO:should calculate discount
  /*it('should calculate discount', () => {
    const cena = [
      ['1490', '745', '1192', '1192'],
      ['1490', '745', '1192', '1192'],
      ['1490', '745', '1192', '1192'],
      ['1900', '950', '1520', '1520'],
      ['1490', '745', '1192', '1192'],
      ['1490', '745', '1192', '1192'],
      ['--', '--', '--', '--']
    ]
    cy.get('#price').invoke('val').then((val) => {
      const digitsAndSpaces = val.match(/([\d\s]+)/)[1];
      const currency = digitsAndSpaces.replace(/\s+/g, '')

      expect(currency).to.equal(cena[0][0])
      for (let i = 1; i < 8; i++) {

        cy.get('.ui-selectmenu-text').eq(0).click()
        cy.get(`#ui-id-${i}`).click()

        for (let j = 1; j < 4; j++) {
          cy.get("[id='slevova-kategorie-button'] .ui-selectmenu-text").type('{downarrow}{enter}')
          cy.get('#price').invoke('val').then((val) => {
            const digitsAndSpaces = val.match(/([\d\s]+)/)[1];
            const currency = digitsAndSpaces.replace(/\s+/g, '')
            expect(currency).to.equal(cena[i][j])
          })
        }
      }
    })
  })*/ 
})