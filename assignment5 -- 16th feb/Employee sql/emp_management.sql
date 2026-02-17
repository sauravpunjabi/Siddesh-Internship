CREATE DATABASE IF NOT EXISTS Emp;
USE Emp;


CREATE TABLE Dept(
    deptID INT PRIMARY KEY AUTO_INCREMENT,
    deptName VARCHAR(100)
);

CREATE TABLE Employee(
    empID INT PRIMARY KEY AUTO_INCREMENT,
    empName VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    hire_date DATE,
    deptID INT,
    managerID INT,
    FOREIGN KEY(deptID) REFERENCES Dept(deptID),
    FOREIGN KEY(managerID) REFERENCES Employee(empID)
);

CREATE TABLE Project(
    projectID INT AUTO_INCREMENT PRIMARY KEY,
    projectName VARCHAR(100) NOT NULL,
    start_date DATE,
    end_date DATE
);

CREATE TABLE EmpProject(
    empID INT,
    projectID INT,
    PRIMARY KEY (empID, projectID),
    FOREIGN KEY(empID) REFERENCES Employee(empID),
    FOREIGN KEY(projectID) REFERENCES Project(projectID)
);

CREATE TABLE Salary(
    empID INT PRIMARY KEY,
    basicSal DECIMAL(10,2),
    bonusSal DECIMAL(10,2),
    FOREIGN KEY(empID) REFERENCES Employee(empID)
);


USE Emp;



INSERT INTO Dept(deptName) VALUES 
('IT'),
('Marketing');

INSERT INTO Employee(empName, email, hire_date, deptID, managerID) VALUES
('Saurav', 'saurav@gmail.com', '2025-01-23', 1, NULL),
('Gaurav', 'gaurav@gmail.com', '2025-01-23', 2, 1),
('Kiran', 'kiran@gmail.com', '2025-02-26', 2, 1),
('Sash', 'sash@gmail.com', '2025-01-24', 1, 1);


INSERT INTO Project(projectName, start_date, end_date) VALUES
('SaaS Application', '2025-02-01', '2025-02-28'),
('Web Application', '2025-03-01', '2025-03-15');

INSERT INTO EmpProject VALUES
(2, 1),
(2, 2),
(3, 1);

INSERT INTO Salary VALUES
(1, 60000, 5000),
(2, 55000, 5000),
(3, 65000, 5000),
(4, 50000, 5000);


-- Employees working on multiple projects query:
SELECT e.empID, e.empName, COUNT(ep.projectID) AS totalProjects
FROM Employee e
JOIN EmpProject ep ON e.empID = ep.empID
GROUP BY e.empID, e.empName
HAVING COUNT(ep.projectID) > 1;

-- total salary per department
SELECT d.deptName,
        SUM(s.basicSal + s.bonusSal) AS totalSal
FROM Employee e
JOIN Dept d ON e.deptID = d.deptID
JOIN Salary s ON e.empID = s.empID
GROUP BY d.deptName

--  retrieving hierarchical data
SELECT e.empName AS Employee,
        m.empName AS Manager
FROM Employee e
LEFT JOIN Employee m
ON e.managerID = m.empID