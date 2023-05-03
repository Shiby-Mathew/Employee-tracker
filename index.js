//import inquirer
//run npm init -y
//run npm i inquirer
//create a class for index.js

//main function
const main = () => {
  //prompt asking for user inputs
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the title of this application ?",
        name: "name",
      },

      {
        type: "list",
        message: "Select which kind of license for this application",
        name: "license",
        choices: [
          "None",
          "Apache License",
          "MIT License",
          "Boost Software License",
          "GNU General Public License",
          "Mozilla Public Licence",
        ],
      },
    ])
    .then((data) => {
      console.log(data);
    });
};
