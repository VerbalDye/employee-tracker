INSERT INTO department (name) VALUES
    ('HR'), ('IT'), ('Operations'), ('Accounting');

INSERT INTO role (title, salary, department_id) VALUES
    ('Help Desk', '40000', 2),
    ('Developer', '75000', 2),
    ('HR Manager', '65000', 1),
    ('Line Worker', '50000', 3),
    ('Line Manager', '65000', 3),
    ('Accountant', '55000', 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
    ('John', 'Mann', 2, NULL),
    ('Blake', 'Ohm', 1, 1),
    ('Tony', 'Duvert', 1, 1),
    ('Dennis', 'Cooper', 3, NULL),
    ('Monica', 'Bellucci', 5, NULL),
    ('Samuel', 'Johnson', 4, 5),
    ('John', 'Dryden', 4, 5),
    ('Alexander', 'Pope', 4, 5),
    ('Lionel', 'Johnson', 5, NULL),
    ('Aubrey', 'Beardsley', 4, 9),
    ('Tulse', 'Luper', 4, 9),
    ('William', 'Morris', 6, NULL);