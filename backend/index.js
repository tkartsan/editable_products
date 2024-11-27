// index.js
const express = require('express');
const cors = require('cors');
const Datastore = require('nedb');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS
app.use(cors());

// Initialize NeDB
const db = new Datastore({ filename: 'db.json', autoload: true });

// GET endpoint with optional query parameters
app.get('/api/items', (req, res) => {
  const queryParams = req.query;
  const query = {};

  // Iterate over query parameters to build the query object
  for (const key in queryParams) {
    const value = queryParams[key];

    if (Array.isArray(value)) {
      // If multiple values are provided, interpret them as a range
      const numbers = value.map(Number).sort((a, b) => a - b);

      // Ensure we have valid numbers
      if (numbers.some(isNaN)) {
        return res.status(400).json({ error: `Invalid number for parameter "${key}"` });
      }

      query[key] = { $gte: numbers[0], $lte: numbers[1] };
    } else if (typeof value === 'string' && value.includes(',')) {
      // If the value contains commas, split it into an array (for $in queries)
      const values = value.split(',');
      query[key] = { $in: values };
    } else {
      // For exact match
      query[key] = value;
    }
  }

  db.find(query, (err, docs) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err });
    }
    res.json({
      message: 'GET request received',
      data: docs,
    });
  });
});


// POST endpoint to add new items
app.post('/api/items', (req, res) => {
  const newItem = req.body;

  if (!newItem || Object.keys(newItem).length === 0) {
    return res.status(400).json({ error: 'Request body is required' });
  }

  // Assign a unique ID to the new item
  newItem.id = uuidv4();

  db.insert(newItem, (err, doc) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err });
    }
    res.status(201).json({
      message: 'Item added successfully',
      data: doc,
    });
  });
});

// PUT endpoint with optional query parameters and body data
app.put('/api/items', (req, res) => {
  const queryParams = req.query;
  const bodyData = req.body;

  if (!bodyData || Object.keys(bodyData).length === 0) {
    return res.status(400).json({ error: 'Request body is required for update' });
  }

  db.update(queryParams, { $set: bodyData }, { multi: true, returnUpdatedDocs: true }, (err, numAffected, affectedDocuments) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err });
    }
    res.json({
      message: 'Items updated successfully',
      data: affectedDocuments,
    });
  });
});

// DELETE endpoint with required query parameter 'id'
app.delete('/api/items', (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Query parameter "id" is required' });
  }

  db.remove({ id: id }, {}, (err, numRemoved) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err });
    }
    if (numRemoved === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({
      message: `Item with id ${id} deleted successfully`,
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});