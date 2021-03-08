const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
const express = require("express");

const app = express();
const PORT = 3000;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Start our server so that it can begin listening to client requests.
app.listen(PORT, function () {
    // Log (server-side) when our server has started
    console.log("Server listening on: http://localhost:" + PORT);
});


const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Donaldwu0512",
    database: "employeesDB",
});

connection.connect(function (err) {
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
    }

    console.log("connected as id " + connection.threadId);

    option();
});

function option() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "Welcome to the EMS. What would you like to do?",
            choices: [
                {
                    name: "ADD a department",
                    value: "addDepartment",
                },
                {
                    name: "ADD a role",
                    value: "addRole",
                },
                {
                    name: "ADD an employee",
                    value: "addEmployee",
                },
                {
                    name: "VIEW current departments, roles, or employees",
                    value: "view",
                },
                {
                    name: "UPDATE emp roles",
                    value: "update",
                },
                {
                    name: "DELETE a department",
                    value: "deleteDepartment",
                },
                {
                    name: "DELETE a role",
                    value: "deleteRole",
                },
                {
                    name: "DELETE an employee",
                    value: "deleteEmployee",
                },
                new inquirer.Separator(),
                {
                    name: "Exit Employee Tracker",
                    value: "exit",
                },
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "view":
                    viewAll();
                    break;

                case "addDepartment":
                    addDepartment();
                    break;

                case "addRole":
                    addRole();
                    break;

                case "addEmployee":
                    addEmployee();
                    break;

                case "update":
                    updateRole();
                    break;

                case "deleteDepartment":
                    deleteDepartment();
                    break;

                case "deleteRole":
                    deleteRole();
                    break;

                case "deleteEmployee":
                    deleteEmployee();
                    break;

                case "exit":
                    connection.end();
                    break;
            }
        });
}

function deleteDepartment() {
    // display department table so user can easily view all IDs
    displayAllDepartments();

    inquirer
        .prompt({
            name: "departmentId",
            type: "input",
            message: "Enter the ID of the department you want to delete",
        })
        .then((answer) => {
            console.log("Deleting department...\n");

            // Delete department
            connection.query(
                "DELETE FROM department WHERE ?",
                {
                    id: answer.departmentId,
                },
                function (err, res) {
                    if (err) throw err;
                    console.log("Department deleted!\n");

                    
                }
            );

            // Update the roles table so that roles that were assigned to this now deleted department are updated to have a department id of '0' which signifies that they are now unassigned to a department
            connection.query(
                "UPDATE roles SET ? WHERE ?",
                [
                    {
                        department_id: "0",
                    },
                    {
                        department_id: answer.departmentId,
                    },
                ],
                function (err, res) {
                    if (err) throw err;
                    console.log(
                        "Roles that were assigned to this department have been updated to '0' which signifies that they are now unassigned to a department.\n"
                    );
                }
            );

            option();
        });
}

function deleteRole() {
    // display department table so user can easily view all IDs
    displayAllRoles();

    inquirer
        .prompt({
            name: "roleId",
            type: "input",
            message: "Enter the ID of the role you want to delete",
        })
        .then((answer) => {
            console.log("Deleting role...\n");

            // Deletes role from table
            connection.query(
                "DELETE FROM roles WHERE ?",
                {
                    id: answer.roleId,
                },
                function (err, res) {
                    if (err) throw err;
                    console.log("Department deleted!\n");
                }
            );

            // Update the employee table so that employees that were assigned to this now deleted role are updated to have a role id of '0' which signifies that they are now unassigned to a department
            connection.query(
                "UPDATE employee SET ? WHERE ?",
                [
                    {
                        role_id: "0",
                    },
                    {
                        role_id: answer.roleId,
                    },
                ],
                function (err, res) {
                    if (err) throw err;
                    console.log(
                        "Employees that were assigned to this role have been updated to '0' which signifies that they are now unassigned to a role.\n"
                    );
                }
            );

            option();
        });
}

function deleteEmployee() {
    // display department table so user can easily view all IDs
    displayAllEmployees();

    inquirer
        .prompt({
            name: "employeeId",
            type: "input",
            message: "Enter the ID of the employee you want to delete",
        })
        .then((answer) => {
            console.log("Deleting employee...\n");
            connection.query(
                "DELETE FROM employee WHERE ?",
                {
                    id: answer.employeeId,
                },
                function (err, res) {
                    if (err) throw err;
                    console.log("Employee deleted!\n");
                }
            );

            option();
        });
}

function updateRole() {
    let employeeId;

    // display employee table so user can easily view all IDs
    displayAllEmployees();

    inquirer
        .prompt({
            name: "employeeId",
            type: "input",
            message: "Enter the ID of the employee you want to update",
        })
        .then((answer) => {
            employeeId = answer.employeeId;

            // display roles table so user can easily decide select a role ID
            displayAllRoles();

            inquirer
                .prompt({
                    name: "roleId",
                    type: "input",
                    message: "Enter the role ID you want the user to have",
                })
                .then((answer) => {
                    console.log("Updating employee role...\n");

                    connection.query(
                        "UPDATE employee SET ? WHERE ?",
                        [
                            {
                                role_id: answer.roleId,
                            },
                            {
                                id: employeeId,
                            },
                        ],
                        function (err, res) {
                            if (err) throw err;
                            console.log("Employee role updated!\n");
                            // Call updateProduct AFTER the INSERT completes
                            initTracker();
                        }
                    );
                });
        });
}

function addDepartment() {
    inquirer
        .prompt({
            name: "department_name",
            type: "input",
            message: "What is the department name?",
        })
        .then((answer) => {
            console.log("Adding a new department...\n");
            connection.query(
                `INSERT INTO department SET ?`,
                {
                    department_name: answer.department_name,
                },
                function (err, res) {
                    if (err) throw err;
                    console.log("New department added!\n");
                    // Call updateProduct AFTER the INSERT completes
                    option();
                }
            );
        });
}

function addRole() {
    inquirer
        .prompt([
            {
                name: "title",
                type: "input",
                message: "What is the role title?",
            },
            {
                name: "salary",
                type: "input",
                message: "What is this roles salary?",
                validate: function (value) {
                    let valid = !isNaN(value);
                    return valid || "Please enter a number";
                },
            },
            {
                name: "department_id",
                type: "input",
                message: "What is this role's department ID?",
            },
        ])
        .then((answer) => {
            console.log("Adding a new role...\n");
            connection.query(
                `INSERT INTO roles SET ?`,
                {
                    title: answer.title,
                    salary: answer.salary,
                    department_id: answer.department_id,
                },
                function (err, res) {
                    if (err) throw err;
                    console.log("New role added!\n");
                    // Call updateProduct AFTER the INSERT completes
                    option();
                }
            );
        });
}

function addEmployee() {
    inquirer
        .prompt([
            {
                name: "firstName",
                type: "input",
                message: "What is the employee's first name?",
            },
            {
                name: "lastName",
                type: "input",
                message: "What is the employee's last name?",
            },
            {
                name: "roleId",
                type: "input",
                message: "What is this employee's role ID?",
            },
            {
                name: "managerId",
                type: "input",
                message: "What is this employee's manager ID?",
            },
        ])
        .then((answer) => {
            console.log("Adding a new employee...\n");
            connection.query(
                `INSERT INTO employee SET ?`,
                {
                    first_name: answer.firstName,
                    last_name: answer.lastName,
                    role_id: answer.roleId,
                    manager_id: answer.managerId,
                },
                function (err, res) {
                    if (err) throw err;
                    console.log("New role added!\n");
                    // Call updateProduct AFTER the INSERT completes
                    option();
                }
            );
        });
}

function viewAll() {
    inquirer
        .prompt({
            name: "table",
            type: "list",
            message:
                "Would you like to view all departments, roles, or employees?",
            choices: [
                {
                    name: "Departments",
                    value: "department",
                },
                {
                    name: "Roles",
                    value: "roles",
                },
                {
                    name: "Employees",
                    value: "employee",
                },
            ],
        })
        .then(function (answer) {
            console.log(`Selecting all from ${answer.table}...`);

            switch (answer.table) {
                case "department":
                    displayAllDepartments();
                    break;

                case "roles":
                    displayAllRoles();
                    break;

                case "employee":
                    displayAllEmployees();
                    break;
            }

            option();
        });
}

function displayAllEmployees() {
    let query = "SELECT * FROM employee ";
    connection.query(query, (err, res) => {
        if (err) throw err;

        console.log("\n\n ** Full Employee list ** \n");
        console.table(res);
    });
}

function displayAllRoles() {
    let query = "SELECT * FROM roles ";
    connection.query(query, (err, res) => {
        if (err) throw err;

        console.log("\n\n ** Full Role list ** \n");
        console.table(res);
    });
}

function displayAllDepartments() {
    let query = "SELECT * FROM department ";
    connection.query(query, (err, res) => {
        if (err) throw err;

        console.log("\n\n ** Full Department list ** \n");
        console.table(res);
    });
}
