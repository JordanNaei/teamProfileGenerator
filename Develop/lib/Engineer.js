const Employee = require("./Employee");

class Engineer extends Employee {
    constructor(name, id , email, username) {
        super(name, id, email);
        this.github = username;    
    }
 
    getRole() {
        return "Engineer"
    }
    getGithub() {
        return this.github;
    }

}

module.exports = Engineer;
