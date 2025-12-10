// api/decks.js - Vercel Serverless Function for CRUD operations

// Встановіть 'pg' для PostgreSQL або 'mongodb' для MongoDB
// npm install pg
import { Pool } from 'pg'; 

// *** НАЛАШТУВАННЯ ПІДКЛЮЧЕННЯ ДО AIVEN ***
// Vercel автоматично зчитує цю змінну з налаштувань проєкту
const pool = new Pool({
  // URL підключення до Aiven DB. Ви отримаєте його від Aiven.
  connectionString: process.env.AIVEN_POSTGRES_URL, 
  ssl: {
    // У Aiven зазвичай вимагається SSL, а rejectUnauthorized: false - це спрощення для розробки.
    // Для продакшену варто використовувати сертифікати Aiven.
    rejectUnauthorized: false, 
  },
  // Використовуйте цей код для забезпечення одного підключення (cold start issue fix)
  max: 1, 
  idleTimeoutMillis: 0,
});

export default async function handler(req, res) {
  const { method } = req;
  // Отримання ID з URL, наприклад, /api/decks/123
  const id = req.query.id; 

  try {
    const client = await pool.connect();
    
    // --- CREATE (POST) ---
    if (method === 'POST') {
      const { title, description, cards } = req.body;
      const newDeck = await client.query(
        'INSERT INTO decks (title, description, cards, updated_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
        // Зберігаємо картки як JSONB у PostgreSQL
        [title, description, JSON.stringify(cards)] 
      );
      res.status(201).json(newDeck.rows[0]);
    } 
    
    // --- READ (GET) ---
    else if (method === 'GET') {
      if (id) {
        // Отримати один набір
        const { rows } = await client.query('SELECT * FROM decks WHERE id = $1', [id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Deck not found' });
        res.status(200).json(rows[0]);
      } else {
        // Отримати всі набори
        const { rows } = await client.query('SELECT * FROM decks ORDER BY updated_at DESC');
        res.status(200).json(rows);
      }
    } 
    
    // --- UPDATE (PUT) ---
    else if (method === 'PUT') {
        const { title, description, cards } = req.body;
        const updatedDeck = await client.query(
            'UPDATE decks SET title = $1, description = $2, cards = $3, updated_at = NOW() WHERE id = $4 RETURNING *',
            [title, description, JSON.stringify(cards), id]
        );
        res.status(200).json(updatedDeck.rows[0]);
    }

    // --- DELETE (DELETE) ---
    else if (method === 'DELETE') {
        await client.query('DELETE FROM decks WHERE id = $1', [id]);
        res.status(204).end(); // No Content
    }
    
    // --- Method Not Allowed ---
    else {
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
    }
    
    client.release();
    
  } catch (error) {
    console.error('Database Operation Error:', error);
    res.status(500).json({ error: 'Failed to process request', details: error.message });
  }
}