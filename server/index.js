const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize the app
const app = express();
const port = 3000;

// Set up middleware
app.use(cors());
app.use(bodyParser.json());

// PostgreSQL connection pool for the default database
const pool = new Pool({
    user: 'postgres', // your PostgreSQL username
    host: 'localhost',
    database: 'postgres', // default database for PostgreSQL
    password: 'pgadmin', // your PostgreSQL password
    port: 5433,
});

// Check if the connection to the database is successful
pool.connect()
    .then(() => {
        console.log('Connected to the PostgreSQL database');
    })
    .catch(err => {
        console.error('Error connecting to the database:', err);
    });

// Run the setup script to create tables
async function setupDatabase() {
    const setupScript = `
        CREATE TABLE IF NOT EXISTS geospatial_data (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255),
            geom JSONB -- Store the geometry as GeoJSON
        );

        CREATE TABLE IF NOT EXISTS point_shapes (
            id SERIAL PRIMARY KEY,
            feature_type VARCHAR(255),
            geometry JSONB -- Store the geometry as GeoJSON
        );

        CREATE TABLE IF NOT EXISTS line_shapes (
            id SERIAL PRIMARY KEY,
            feature_type VARCHAR(255),
            geometry JSONB -- Store the geometry as GeoJSON
        );

        CREATE TABLE IF NOT EXISTS polygon_shapes (
            id SERIAL PRIMARY KEY,
            feature_type VARCHAR(255),
            geometry JSONB -- Store the geometry as GeoJSON
        );
    `;

    try {
        const client = await pool.connect();
        await client.query(setupScript);
        console.log('Database setup successful');
        client.release();
    } catch (err) {
        console.error('Error setting up database:', err);
    }
}

// Run the database setup when the server starts
setupDatabase();

// Route for adding geometries based on feature type
app.post('/add-feature', async (req, res) => {
    const { featureType, geometry } = req.body;
    const tableName = getTableName(featureType); // Determine the table based on feature type

    const query = `
        INSERT INTO ${tableName} (feature_type, geometry)
        VALUES ($1, $2)
        RETURNING id;
    `;
    
    try {
        const result = await pool.query(query, [featureType, geometry]); // Insert the geometry into the correct table
        res.status(200).json({ id: result.rows[0].id }); // Return the ID of the inserted geometry
    } catch (err) {
        console.error(`Error saving ${featureType} feature:`, err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Helper function to determine the table name based on feature type
function getTableName(featureType) {
    switch (featureType) {
        case 'Point':
            return 'point_shapes';
        case 'LineString':
            return 'line_shapes';
        case 'Polygon':
            return 'polygon_shapes';
        default:
            return 'geospatial_data'; // Fallback table name
    }
}

// Route to fetch all geometries from the main geospatial data table
app.get('/get-geometries', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name, geom FROM geospatial_data');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching geometries');
    }
});

// Route to fetch all points
app.get('/get-points', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, feature_type, geometry FROM point_shapes');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching points');
    }
});

// Route to fetch all lines
app.get('/get-lines', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, feature_type, geometry FROM line_shapes');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching lines');
    }
});

// Route to fetch all polygons
app.get('/get-polygons', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, feature_type, geometry FROM polygon_shapes');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching polygons');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
