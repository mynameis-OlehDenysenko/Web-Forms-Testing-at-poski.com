
module.exports = {
    fillInput: function (selector, value){
        cy.get(selector)
        .type(value)
        .blur()
    }
}