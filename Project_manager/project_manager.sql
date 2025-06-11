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
INSERT INTO project_table (project_name, project_description, database_id, database_path)
VALUES 
  ('CRM System', 'Customer relationship management platform', 1, '/crm'),
  ('Inventory Manager', 'Tool to track stock and supply', 1, '/inventory'),
  ('Learning Portal', 'Online education management', 1, '/lms');


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
  field_datatype_name VARCHAR(255) NOT NULL
);


INSERT INTO all_table (project_id, table_name, table_description) VALUES
('Text'),
('NUMERIC (15, 2)'),
('boolean'),
('date'),
('time'),
('Image'),
('bytea	');
