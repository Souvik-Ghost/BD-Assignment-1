let express = require("express");
let app = express();
let port = process.env.PORT || 3000;
let db;
let sqlite3 = require("sqlite3").verbose();
let { open } = require("sqlite");
app.use(express.json());
//Connect to the database
(async () => {
  db = await open({
    filename: "BD-4.5-HW2/database.sqlite",
    driver: sqlite3.Database,
  });
})();
//Message
app.get("/", (req, res) => {
  res.status(200).json({ message: "BD 4.5 HW2 SQL Comparison Operators" });
});
//To connect sqlite database run: /node BD-4.5-HW2/initDB.js
//To run the project: /node BD-4.5-HW2
// THE ENPOINTS
//1 /employees/salary?minSalary=80000
async function filterEmployeesBySalary(minSalary) {
  let query = "SELECT * FROM employees WHERE salary >= ?";
  let response = await db.all(query, [minSalary]);
  return { employees: response };
}
app.get("/employees/salary", async (req, res) => {
  let minSalary = req.query.minSalary;
  try {
    let response = await filterEmployeesBySalary(minSalary);
    if (response.employees.length === 0) {
      return res.status(404).json({
        message: `No employees found with the given salary of ${minSalary}.`,
      });
    }
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
//2 employees/department-experience?department=Engineering&minExperience=5
async function filterEmployeesByDepartmentAndExperience(
  department,
  minExperience,
) {
  let query =
    "SELECT * FROM employees WHERE department = ? AND years_of_experience >= ?";
  let response = await db.all(query, [department, minExperience]);
  return { employees: response };
}
app.get("/employees/department-experience", async (req, res) => {
  let department = req.query.department;
  let minExperience = req.query.minExperience;
  try {
    let response = await filterEmployeesByDepartmentAndExperience(
      department,
      minExperience,
    );
    if (response.employees.length === 0) {
      return res.status(404).json({
        message: `No employees found with the given department of ${department} and experience of ${minExperience}.`,
      });
    }
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
//3 employees/ordered-by-salary
async function fetchEmployeesOrderedBySalary(salary) {
  let query = "SELECT * FROM employees ORDER BY salary DESC";
  let response = await db.all(query, [salary]);
  return { employees: response }
}
app.get("/employees/ordered-by-salary", async (req, res) => {
  let salary = req.query.salary;
  try {
    let response = await fetchEmployeesOrderedBySalary(salary);
    if (response.employees.length === 0) {
      return res.status(404).json({
        message: `No employees found with the given salary of ${salary}.`,
      });
    }
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
//Server Port connection Message
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
