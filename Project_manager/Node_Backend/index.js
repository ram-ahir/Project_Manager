import express from "express";
import cors from 'cors';
import 'dotenv/config';
import pool from './db.js';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to my server!');
});

app.get('/api/database', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM database_table ORDER BY database_id');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// ###########################################################################  projects

// GET projects
app.get('/api/project', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM project_table ORDER BY project_id');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// POST - Add new project
app.post('/api/project', async (req, res) => {
  const { project_name, project_description, database_id, database_path, project_path } = req.body;
  const result = await pool.query(
    `INSERT INTO project_table (project_name, project_description, database_id, database_path, project_path)
     VALUES ($1, $2,$3 ,$4, $5) RETURNING *`,
    [project_name, project_description, database_id, database_path, project_path]
  );
  res.status(201).json(result.rows[0]);
});

// PUT - Update existing project
app.put('/api/project/:id', async (req, res) => {
  const { project_name, project_description, database_id, database_path, project_path } = req.body;
  const { id } = req.params;

  const result = await pool.query(
    `UPDATE project_table 
     SET project_name = $1, 
         project_description = $2, 
         database_id =  $3,
         database_path = $4,
         project_path = $5
     WHERE project_id = $6
     RETURNING *`,
    [project_name, project_description, database_id, database_path, project_path, id]
  );
  res.json(result.rows[0]);
});

// DELETE - Delete project
app.delete('/api/project/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query(`DELETE FROM project_table WHERE project_id = $1`, [id]);
  res.status(204).send();
});

// ###########################################################################  Tables

// GET /api/tables?project_id=1
app.get('/api/tables', async (req, res) => {
  const { project_id } = req.query;
  if (!project_id) return res.status(400).json({ error: 'Missing project_id' });
  try {
    const result = await pool.query(
      `SELECT * FROM all_table WHERE project_id = $1`,
      [project_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching tables:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST - Create new table
app.post('/api/tables', async (req, res) => {
  let { project_id, table_name, table_description, is_generated = false, generated_date } = req.body;

  // Convert empty string to null for PostgreSQL timestamp
  if (generated_date === '') generated_date = null;

  try {
    const result = await pool.query(
      `INSERT INTO all_table (project_id, table_name, table_description, is_generated, generated_date)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [project_id, table_name, table_description, is_generated, generated_date]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error inserting table:', err);
    res.status(500).json({ error: 'Failed to create table' });
  }
});

// PUT - Update table
app.put('/api/tables/:id', async (req, res) => {
  let { table_name, table_description, is_generated, generated_date } = req.body;
  const { id } = req.params;

  if (generated_date === '') generated_date = null;

  try {
    const result = await pool.query(
      `UPDATE all_table
         SET table_name = $1,
             table_description = $2,
             is_generated = $3,
             generated_date = $4
       WHERE table_id = $5
       RETURNING *`,
      [table_name, table_description, is_generated, generated_date, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating table:', err);
    res.status(500).json({ error: 'Failed to update table' });
  }
});


// DELETE - Delete table
app.delete('/api/tables/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query(`DELETE FROM all_table WHERE table_id = $1`, [id]);
  res.status(204).send();
});

// ###########################################################################  Tables Wise Field
// GET table name for a given table_id
app.get('/api/gettablename', async (req, res) => {
  const { table_id } = req.query;
  if (!table_id) return res.status(400).json({ error: 'Missing table_id' });

  try {
    const result = await pool.query(
      `SELECT table_name FROM all_table WHERE table_id = $1 `,
      [table_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching Table Name:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// GET all fields for a given table
app.get('/api/fields', async (req, res) => {
  const { table_id } = req.query;
  if (!table_id) return res.status(400).json({ error: 'Missing table_id' });

  try {
    const result = await pool.query(
      `SELECT * FROM table_wise_field WHERE table_id = $1 ORDER BY table_wise_field_id`,
      [table_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching fields:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST - Create new field
app.post('/api/fields', async (req, res) => {
  let {
    table_id,
    field_name,
    field_datatype_id,
    is_primary = false,
    field_label,
    display_name,
    is_auto_increment = false,
    is_foreign_key = false,
    reference_table_id,
    reference_table_field_id
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO table_wise_field 
        (table_id, field_name, field_datatype_id, is_primary, field_label, display_name, is_auto_increment, is_foreign_key, reference_table_id, reference_table_field_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING *`,
      [
        table_id,
        field_name,
        field_datatype_id,
        is_primary,
        field_label || null,
        display_name || null,
        is_auto_increment,
        is_foreign_key,
        reference_table_id || null,
        reference_table_field_id || null
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error inserting field:', err);
    res.status(500).json({ error: 'Failed to insert field' });
  }
});

// PUT - Update a field
app.put('/api/fields/:id', async (req, res) => {
  const { id } = req.params;
  let {
    table_id,
    field_name,
    field_datatype_id,
    is_primary = false,
    field_label,
    display_name,
    is_auto_increment = false,
    is_foreign_key = false,
    reference_table_id,
    reference_table_field_id
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE table_wise_field SET
        table_id = $1,
        field_name = $2,
        field_datatype_id = $3,
        is_primary = $4,
        field_label = $5,
        display_name = $6,
        is_auto_increment = $7,
        is_foreign_key = $8,
        reference_table_id = $9,
        reference_table_field_id = $10
       WHERE table_wise_field_id = $11
       RETURNING *`,
      [
        table_id,
        field_name,
        field_datatype_id,
        is_primary,
        field_label || null,
        display_name || null,
        is_auto_increment,
        is_foreign_key,
        reference_table_id || null,
        reference_table_field_id || null,
        id
      ]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating field:', err);
    res.status(500).json({ error: 'Failed to update field' });
  }
});

// DELETE - Delete a field
app.delete('/api/fields/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(
      `DELETE FROM table_wise_field WHERE table_wise_field_id = $1`,
      [id]
    );
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting field:', err);
    res.status(500).json({ error: 'Failed to delete field' });
  }
});

// datatype by database id
app.get('/api/datatype', async (req, res) => {
  const { database_id } = req.query;
  if (!database_id) return res.status(400).json({ error: 'Missing database_id' });
  try {
    const result = await pool.query(
      `SELECT * FROM field_datatype WHERE database_table_id = $1`,
      [database_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching datatypes:', err);
  }
  try {
    const result = await pool.query(
      `SELECT * FROM field_datatype WHERE database_table_id = $1`,
      [database_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching datatypes:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});



//############################################################################################# 
app.get('/api/generate-sql', async (req, res) => {
  const { table_id } = req.query;
  const xtable_id = toString(table_id);
  if (!table_id) return res.status(400).json({ error: 'Missing table_id' });

  try {
    const tableRes = await pool.query(`SELECT * FROM all_table WHERE table_id = $1`, [table_id]);
    const fieldsRes = await pool.query(`SELECT * FROM table_wise_field WHERE table_id = $1`, [table_id]);

    const table = tableRes.rows[0];
    const fields = fieldsRes.rows;

    let sql = `CREATE TABLE ${table.table_name} (\n`;

    // Resolve all datatype names first
    const columnLines = await Promise.all(fields.map(async (f) => {
      const datatype = await getSQLType(f.field_datatype_id);

      let line = `  ${f.field_name} ${datatype}`;
      if (f.is_auto_increment) line += ' SERIAL';
      if (f.is_primary) line += ' PRIMARY KEY';
      return line;
    }));

    sql += columnLines.join(',\n') + '\n);';

    res.json({ query: sql });
  } catch (err) {
    console.error('Error generating SQL:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Make sure getSQLType is async
const getSQLType = async (datatypeId) => {
  const result = await pool.query(
    `SELECT datatype_name FROM field_datatype WHERE field_datatype_id = $1`,
    [datatypeId]
  );

  return result.rows[0]?.datatype_name || 'TEXT';
};



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
