-- Table: database_table
CREATE TABLE database_table (
    database_id SERIAL PRIMARY KEY,
    database_name VARCHAR(255) NOT NULL
);


-- Table: project_table
CREATE TABLE project_table (
    project_id SERIAL PRIMARY KEY,
    project_name VARCHAR(255) NOT NULL,
    project_description TEXT,
    database_id INTEGER NOT NULL,
    database_path TEXT,
    project_path TEXT,

    CONSTRAINT fk_database
      FOREIGN KEY (database_id)
      REFERENCES database_table(database_id)
      ON DELETE CASCADE
);

INSERT INTO database_table (database_name)
VALUES 
  ('MySQL'),
  ('PostgreSQL'),
  ('mongoDB');


-- Sample Projects (Assume database_id = 1 for all)
INSERT INTO project_table (project_name, project_description, project_path, database_id, database_path)
VALUES 
  ('CRM System', 'Customer relationship management platform', '/crm', 1, '/crm'),
  ('Inventory Manager', 'Tool to track stock and supply', '/crm', 1, '/inventory'),
  ('Learning Portal', 'Online education management', '/crm', 1, '/lms');


CREATE TABLE all_table (
  table_id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL,
  table_name VARCHAR(255) NOT NULL,
  table_description TEXT,
  is_generated BOOLEAN DEFAULT false,
  generated_date TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES project_table(project_id) ON DELETE CASCADE
);

-- Sample Tables for CRM System (project_id = 1)
INSERT INTO all_table (project_id, table_name, table_description, is_generated, generated_date)
VALUES
  (1, 'customers', 'Stores customer details', false, NULL),
  (1, 'leads', 'Tracks marketing leads', false, NULL),
  (1, 'interactions', 'Customer interactions log', false, NULL);

-- Sample Tables for Inventory Manager (project_id = 2)
INSERT INTO all_table (project_id, table_name, table_description, is_generated, generated_date)
VALUES
  (2, 'products', 'Product catalog', false, NULL),
  (2, 'suppliers', 'Supplier contact details', false, NULL),
  (2, 'stock_entries', 'Stock change history', false, NULL);

-- Sample Tables for Learning Portal (project_id = 3)
INSERT INTO all_table (project_id, table_name, table_description, is_generated, generated_date)
VALUES
  (3, 'students', 'Student enrollment data', false, NULL),
  (3, 'courses', 'Course listings and details', false, NULL),
  (3, 'assignments', 'Submitted assignments', false, NULL);


CREATE TABLE field_datatype (
  field_datatype_id SERIAL PRIMARY KEY,
  datatype_name VARCHAR(100) NOT NULL,
  database_table_id INTEGER NOT NULL,
  
  CONSTRAINT fk_database_table
    FOREIGN KEY (database_table_id)
    REFERENCES database_table(database_id)
    ON DELETE CASCADE
);



INSERT INTO field_datatype (datatype_name, database_table_id) VALUES
('Text',2),
('NUMERIC (15, 2)',2),
('boolean',2),
('date',2),
('time',2),
('Image',2),
('bytea	',2);


CREATE TABLE table_wise_field (
  table_wise_field_id SERIAL PRIMARY KEY,
  table_id INTEGER NOT NULL,
  field_name VARCHAR(255) NOT NULL,
  field_datatype_id INTEGER NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  field_label VARCHAR(255),
  display_name VARCHAR(255),  -- 🆕 added field
  is_auto_increment BOOLEAN DEFAULT false,
  is_foreign_key BOOLEAN DEFAULT false,
  reference_table_id INTEGER,
  reference_table_field_id INTEGER,

  -- Foreign Keys
  CONSTRAINT fk_table FOREIGN KEY (table_id)
    REFERENCES all_table(table_id) ON DELETE CASCADE,

  CONSTRAINT fk_datatype FOREIGN KEY (field_datatype_id)
    REFERENCES field_datatype(field_datatype_id) ON DELETE RESTRICT,

  CONSTRAINT fk_reference_table FOREIGN KEY (reference_table_id)
    REFERENCES all_table(table_id) ON DELETE SET NULL,

  CONSTRAINT fk_reference_field FOREIGN KEY (reference_table_field_id)
    REFERENCES table_wise_field(table_wise_field_id) ON DELETE SET NULL
);



-- Assume reference_table_field_id 11 refers to course_id in courses table
INSERT INTO table_wise_field (
  table_id, field_name, field_datatype_id, is_primary, field_label, display_name, 
  is_auto_increment, is_foreign_key, reference_table_id, reference_table_field_id
) VALUES 
(6, 'student_id', 1, true, 'Student ID', 'Student ID', true, false, NULL, NULL),
(6, 'student_name', 2, false, 'Name', 'Student Name', false, false, NULL, NULL),
(6, 'email', 2, false, 'Email Address', 'Email', false, false, NULL, NULL),
(6, 'dob', 4, false, 'Date of Birth', 'DOB', false, false, NULL, NULL),
(6, 'course_id', 1, false, 'Course', 'Enrolled Course', false, true, NULL,NULL );


INSERT INTO table_wise_field (
  table_id, field_name, field_datatype_id, is_primary, field_label, display_name, 
  is_auto_increment, is_foreign_key, reference_table_id, reference_table_field_id
) VALUES 
(7, 'course_id', 1, true, 'Course ID', 'Course ID', true, false, NULL, NULL),
(7, 'course_name', 2, false, 'Course Name', 'Course Name', false, false, NULL, NULL),
(7, 'course_description', 3, false, 'Description', 'Course Description', false, false, NULL, NULL),
(7, 'credits', 1, false, 'Credits', 'Credit Hours', false, false, NULL, NULL),
(7, 'created_on', 4, false, 'Created Date', 'Creation Date', false, false, NULL, NULL);
