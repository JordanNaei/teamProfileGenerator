const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

teamBuilt = [];
membersIds = [];

// The questions' arrays that will be used throughout the application 
const starterQuestions = [
    {
        type: "input",
        message: "What is The Manager Name for this Team you are building?",
        name: "mName",
        validate(managerName) {
            if (managerName.trim().length < 1 || !isNaN(managerName)) {
                return "Please enter a valid name"
            } else {
                return true;
            }
        }
    },
    {
        type: "input",
        message: "What is The Manager ID?",
        name: "mId",
        validate(managerId) {
            if (managerId.trim().length < 1) {
                return "Please enter a valid Id"
            } else {
                return true;
            }
        }
    },
    {
        type: "input",
        message: "What is The Manager email address?",
        name: "mEmail",
        validate(managerEmail) {
            if (managerEmail.trim().length < 1 || !managerEmail.includes('@')) {
                return "Please enter a valid email address"
            } else {
                return true;
            }
        }
    },
    {
        type: "input",
        message: "What is The Manager Office Number?",
        name: "mOfficeNum",
        validate(managerOfficeNumber) {
            if (managerOfficeNumber.trim().length < 1 || isNaN(managerOfficeNumber)) {
                return "Please enter a valid office number"
            } else {
                return true;
            }
        }
    },
];

const initialTeamBuild = [
    {
        type: "list",
        message: "What is the next team member occupation?",
        name: "nextMember",
        choices: [
            "Engineer",
            "Intern",
            "Team Completed"
        ],
    },
];

const generalEmpQuestions = [
    {
        type: "input",
        message: "What is The Employee Name?",
        name: "emName",
        validate(employeeName) {
            if (employeeName.trim().length < 1 || !isNaN(employeeName)) {
                return "Please enter a valid name"
            } else {
                return true;
            }
        }
    },
    {
        type: "input",
        message: "What is The Employee ID?",
        name: "emId",
        validate(employeeId) {
            if (employeeId.trim().length < 1) {
                return "Please enter a valid Id"
            } else {
                return true;
            }
        }
    },
    {
        type: "input",
        message: "What is The Employee email address?",
        name: "emEmail",
        validate(employeeEmail) {
            if (employeeEmail.trim().length < 1 || !employeeEmail.includes('@')) {
                return "Please enter a valid email address"
            } else {
                return true;
            }
        }
    },
];

const engineerExtrQ = [{
    type: "input",
    name: "enGithub",
    message: "Please provide this Engineer's Github Username?",
    validate(gitUsername) {
        if (gitUsername.trim().length < 1) {
            return "Please enter a valid Git Username"
        } else {
            return true;
        }
    }
}];
const internExtrQ = [{
    type: "input",
    name: "iSchool",
    message: "What is the name of the school this Intern graduated from?",
    validate(school) {
        if (school.trim().length < 1) {
            return "Please enter a valid School name"
        } else {
            return true;
        }
    }
}];

//  The functions section where all the functions used in our application will be used
async function startWithManager() {
    console.log("We started taken the team manager info");
    try {
        const mRes = await inquirer.prompt(starterQuestions);
        console.log(mRes);
        const managerInfo = new Manager(mRes.mName, mRes.mId, mRes.mEmail, mRes.mOfficeNum);
        console.clear();
        teamBuilt.push(managerInfo);
        membersIds.push(mRes.mId);
        completeTeam();

    } catch (error) {
        throw new Error(error);
    }
};

async function completeTeam() {
    console.log("We started building the team");
    try {
        const resp = await inquirer.prompt(initialTeamBuild);
        
        if (resp.nextMember === "Engineer") {
            console.clear();
            addEngineerInfo();
        }
        else if (resp.nextMember === "Intern") {
            console.clear();
            addInternInfo();
        }
        else {
            console.clear();
            teamEntryCompleted();
        }
    } catch (error) {
        throw new Error(error);
    }
};

async function addEngineerInfo() {
    console.log("Adding an Engineer to the Team");
    const engquestionsList = generalEmpQuestions.concat(engineerExtrQ);
    try {
        const res = await inquirer.prompt(engquestionsList)
        var gitUrl = `https://github.com/${res.enGithub}`
        const engineerInfo = new Engineer(res.emName, res.emId, res.emEmail, gitUrl);
        teamBuilt.push(engineerInfo);
        membersIds.push(res.emId);
        console.clear();
        completeTeam();
    } catch (error) {
        throw new Error(error);
    }
}

async function addInternInfo() {
    console.log("Adding an Intern to the Team");
    const IntquestionsList = generalEmpQuestions.concat(internExtrQ);
    try {
        const res = await inquirer.prompt(IntquestionsList)
        console.log(res);
        const internInfo = new Intern(res.emName, res.emId, res.emEmail, res.iSchool);
        teamBuilt.push(internInfo);
        membersIds.push(res.emId);
        console.clear();
        completeTeam();
    } catch (error) {
        throw new Error(error);
    }
}
function teamEntryCompleted() {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR)
    }
    fs.writeFileSync(outputPath, render(teamBuilt), "utf-8");
    console.log("html file is ready for usage, the file located inside the output folder");
}
// Initializing the application
startWithManager();
