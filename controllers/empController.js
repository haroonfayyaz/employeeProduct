const db = require("../models");

const noOfEmployeesInEachDepartment = async () => {
  console.log("No Of Employees In Each Department");
  if (db !== undefined && db["Emp"] !== undefined) {
    const result = await db["Emp"].findAll({
      attributes: [
        "dept_no",
        [db.Sequelize.fn("count", db.Sequelize.col("dept_no")), "count"],
      ],
      group: ["dept_no"],
      order: [["dept_no"]],
    });
    for (i in result) {
      console.log(
        "Department No: ",
        result[i].dataValues.dept_no,
        ", Count:  ",
        result[i].dataValues.count
      );
    }
  }
};
const avgSalaryForEachJob = async () => {
  console.log("Average Salary For Each Job");
  if (db !== undefined && db["Emp"] !== undefined) {
    const result = await db["Emp"].findAll({
      attributes: [
        "Job",
        [
          db.Sequelize.fn(
            "ROUND",
            db.Sequelize.fn("avg", db.Sequelize.col("Sal")),
            2
          ),
          "avg_sal",
        ],
      ],
      //   include: {
      //     model: db["Emp"],
      //     as: "MGR",
      //     exclude: ["createdAt", "updatedAt"],
      //   },
      group: ["Job"],
      order: [[db.Sequelize.literal("avg_sal"), "DESC"]],
    });
    for (i in result) {
      console.log(
        "Job: ",
        result[i].dataValues.Job,
        ", Average Salary:  ",
        result[i].dataValues.avg_sal
      );
    }
  }
};

const minAndMaxSalary = async () => {
  const result = await db["Emp"].findAll({
    attributes: [
      "dept_no",
      [db.Sequelize.fn("min", db.Sequelize.col("Sal")), "minSalary"],
      [db.Sequelize.fn("max", db.Sequelize.col("Sal")), "maxSalary"],
    ],
    group: ["dept_no"],
    order: [["dept_no"]],
  });
  for (let i in result) {
    console.log(
      "DeptNo: ",
      result[i].dataValues.dept_no,
      "Min Salary: ",
      result[i].dataValues.minSalary,
      "Max Salary: ",
      result[i].dataValues.maxSalary
    );
  }
};

const totalSalaryForClerkAndAnalyst = async () => {
  const result = await db["Emp"].findAll({
    attributes: [
      "Job",
      [db.Sequelize.fn("sum", db.Sequelize.col("Sal")), "total_sal"],
    ],
    where: {
      Job: {
        [db.Sequelize.Op.in]: ["CLERK", "ANALYST"],
      },
    },
    group: ["Job"],
  });

  for (const i in result) {
    console.log(
      "Job: ",
      result[i].dataValues.Job,
      ", Total Salary: ",
      result[i].dataValues.total_sal
    );
  }
};

const employeesHiredInSpecificYear = async (year = 1981) => {
  const result = await db["Emp"].findAll({
    attributes: ["ename"],
    where: db.Sequelize.where(
      db.Sequelize.fn("YEAR", db.Sequelize.col("hire_date")),
      year
    ),
  });
  for (const i in result) {
    console.log("Employee Name: ", result[i].dataValues.ename);
  }
};

const employeesNotHiredInSpecificYear = async (year = 1981) => {
  const result = await db["Emp"].findAll({
    attributes: ["ename"],
    where: db.Sequelize.where(
      db.Sequelize.fn("YEAR", db.Sequelize.col("hire_date")),
      {
        [db.Sequelize.Op.not]: year,
      }
    ),
  });
  for (const i in result) {
    console.log("Employee Name: ", result[i].dataValues.ename);
  }
};

const employeesHiredAfterSpecificYear = async (year = 1981) => {
  const result = await db["Emp"].findAll({
    attributes: ["ename"],
    where: db.Sequelize.where(
      db.Sequelize.fn("Year", db.Sequelize.col("hire_date")),
      {
        [db.Sequelize.Op.gt]: year,
      }
    ),
  });
  for (const i in result) {
    console.log("Employee Name: ", result[i].dataValues.ename);
  }
};

const employeesHiredinSpecificMonth = async (month = "December") => {
  const result = await db["Emp"].findAll({
    attributes: ["ename"],
    where: db.Sequelize.where(
      db.Sequelize.fn("date_format", db.Sequelize.col("hire_date"), "%M"),
      month
    ),
  });
  for (const i in result) {
    console.log(result[i].dataValues.ename);
  }
};

const employeesHiredBeforeSpecificMonthAndYear = async (
  year = 1981,
  months = 4
) => {
  const result = await db["Emp"].findAll({
    attributes: ["ename", "hire_date"],
    where: [
      db.Sequelize.where(
        db.Sequelize.fn("Year", db.Sequelize.col("hire_date")),
        year
      ),
      db.Sequelize.where(
        db.Sequelize.fn("Month", db.Sequelize.col("hire_date")),
        {
          [db.Sequelize.Op.lte]: months,
        }
      ),
    ],
  });
  for (const i in result) {
    console.log(
      "EName: ",
      result[i].dataValues.ename,
      ", Hire_Date: ",
      result[i].dataValues.hire_date
    );
  }
};

const daysLeftTillNow = async () => {
  const result = await db["Emp"].findAll({
    attributes: [
      "hire_date",
      [
        db.Sequelize.fn(
          "datediff",
          db.Sequelize.fn("NOW"),
          db.Sequelize.col("hire_date")
        ),
        "days",
      ],
    ],
  });
  for (const i in result) {
    console.log(
      "Hire Date: ",
      result[i].dataValues.hire_date,
      ", Days: ",
      result[i].dataValues.days
    );
  }
};

const employeesHiredOnSpecificDateOfMonth = async (date) => {
  const result = await db["Emp"].findAll({
    attributes: [
      [db.Sequelize.fn("count", db.Sequelize.col("emp_no")), "count"],
    ],
    where: db.Sequelize.where(
      db.Sequelize.fn("DAY", db.Sequelize.col("hire_date")),
      date
    ),
  });
  for (const i in result) {
    console.log("Count: ", result[i].dataValues.count);
  }
};

const addYearsInHireDate = async (years) => {
  const result = await db["Emp"].findAll({
    attributes: [
      "ename",
      [
        db.Sequelize.fn(
          "DATE_ADD",
          db.Sequelize.col("hire_date"),
          db.Sequelize.literal(`INTERVAL ${years} YEAR`)
        ),
        "New_Date",
      ],
    ],
  });
  for (const i in result) {
    console.log(
      "EName: ",
      result[i].dataValues.ename,
      "Date: ",
      result[i].dataValues.New_Date
    );
  }
};

const test = async () => {
  //   await noOfEmployeesInEachDepartment();
  //   await avgSalaryForEachJob();
  //   await minAndMaxSalary();
  //   await totalSalaryForClerkAndAnalyst();
  //   await employeesHiredInSpecificYear();
  //   await employeesNotHiredInSpecificYear();
  //   await employeesHiredAfterSpecificYear();
  //   await employeesHiredinSpecificMonth();
  //   await employeesHiredBeforeSpecificMonthAndYear();
  //   await daysLeftTillNow();
  //   await employeesHiredOnSpecificDateOfMonth(9);
  await addYearsInHireDate(5);
};

test();
