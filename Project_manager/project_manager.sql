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
    datapath_path TEXT,

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


INSERT INTO project_table (project_name, project_description, database_id, datapath_path)
VALUES 
  ('Inventory System', 'Manages product stock levels and supplier info', 1, '/data/inventory'),
  ('HR Portal', 'Handles employee records and payroll system', 2, '/data/hr'),
  ('Analytics Dashboard', 'Provides insights and data visualizations', 3, '/data/analytics'),
  ('Client CRM', 'Tracks client interactions and sales pipeline', 1, '/data/crm');

