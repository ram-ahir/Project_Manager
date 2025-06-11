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

app.get('/api/project', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM project_table ORDER BY project_id');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
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



// POST - Add new project
app.post('/api/project', async (req, res) => {
  const { project_name, project_description, database_id, database_path } = req.body;
  const result = await pool.query(
    `INSERT INTO project_table (project_name, project_description, database_id, database_path)
     VALUES ($1, $2,$3 ,$4) RETURNING *`,
    [project_name, project_description, database_id, database_path]
  );
  res.status(201).json(result.rows[0]);
});

// PUT - Update existing project
app.put('/api/project/:id', async (req, res) => {
  const { project_name, project_description, database_id, database_path } = req.body;
  const { id } = req.params;

  const result = await pool.query(
    `UPDATE project_table 
     SET project_name = $1, 
         project_description = $2, 
         database_id =  $3,
         database_path = $4
     WHERE project_id = $5 
     RETURNING *`,
    [project_name, project_description, database_id, database_path, id]
  );
  res.json(result.rows[0]);
});

// ###########################################################################  Tables

// GET /api/tables?project_id=1
app.get('/api/tables', async (req, res) => {
  const { project_id } = req.query;

  if (!project_id) {
    return res.status(400).json({ error: 'Missing project_id' });
  }

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
  const { project_id, table_name, table_description } = req.body;
  const result = await pool.query(
    `INSERT INTO all_table (project_id, table_name, table_description)
     VALUES ($1, $2, $3) RETURNING *`,
    [project_id, table_name, table_description]
  );
  res.status(201).json(result.rows[0]);
});

// PUT - Update table
app.put('/api/tables/:id', async (req, res) => {
  const { table_name, table_description } = req.body;
  const { id } = req.params;
  const result = await pool.query(
    `UPDATE all_table SET table_name=$1, table_description=$2 WHERE table_id=$3 RETURNING *`,
    [table_name, table_description, id]
  );
  res.json(result.rows[0]);
});

// DELETE - Delete table
app.delete('/api/tables/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query(`DELETE FROM all_table WHERE table_id = $1`, [id]);
  res.status(204).send();
});




app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
