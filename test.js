class Person {
    constructor(firstName, lastName, age) {
        this.firstName = firstName
        this.lastName = lastName
        this.age = age
    }    
}




class Worker extends Person {
    constructor (firstName, lastName, age, job) {
        super (firstName, lastName, age)
        this.firstName = firstName
        this.lastName = lastName
        this.age = age
        this.job = job
    
  
    }
}

module.exports = Person;