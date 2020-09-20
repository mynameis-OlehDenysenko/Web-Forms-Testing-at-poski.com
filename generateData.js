const faker = require('faker');

const generateData = (defaults = {}) => {
  const validName = faker.name.findName()
  const invalidName = '!@#!@$@#%#%^ ^$#%^#$@%@#'
  const validPhoneNumber = faker.phone.phoneNumber()
  const invalidPhoneNumber = 'this is definitely invalid phone number'
  const validEmail = faker.internet.email()
  const invalidEmail = 'i!#$%^^&&^%$%*())()(()VDHSDJHFBK)(__@DSA#&(#$)FDSI)F_(ASD_FDI)CXS..........c'
  const companyName = faker.company.companyName()
  const paragraph = faker.lorem.paragraph()

  const data = {
    validName,
    invalidName,
    validPhoneNumber,
    invalidPhoneNumber,
    validEmail,
    invalidEmail,
    companyName,
    paragraph
  }

  return Object.assign({}, data, defaults)
}

module.exports = generateData