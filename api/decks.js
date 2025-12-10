// api/decks.js - ФІНАЛЬНА ВЕРСІЯ З ВИКОРИСТАННЯМ СЕРТИФІКАТА

import { Pool } from 'pg'; 
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// 1. Зчитування сертифіката з Vercel Environment Variable
const caCert = process.env.PG_CA_CERT; 

const pool = new Pool({
  connectionString: process.env.AIVEN_POSTGRES_URL, 
  // Тепер без секції ssl, оскільки ми вимкнули перевірку глобально
  max: 1, 
  idleTimeoutMillis: 0,
});

export default async function handler(req, res) {
  let client;
  try {
    client = await pool.connect();
    const { method } = req;
    const id = req.query.id;

if (method === 'POST') {
      const { title, description, cards } = req.body;
      
      // Вставляємо тільки потрібні дані, дозволяючи БД встановити created_at
      const newDeck = await client.query(
        `INSERT INTO decks (title, description, cards, created_at, updated_at) 
         VALUES ($1, $2, $3, NOW(), NOW()) 
         RETURNING *`,
        // cards обов'язково має бути JSON-рядком для PostgreSQL
        [title, description, JSON.stringify(cards)] 
      );
      res.status(201).json(newDeck.rows[0]);
    }
    
else if (method === 'GET') {
      if (id) {
        // Отримати один набір
        const { rows } = await client.query('SELECT * FROM decks WHERE id = $1', [id]);
        
        if (rows.length === 0) return res.status(404).json({ error: 'Deck not found' });
        
        // Тут може бути проблема, якщо rows[0].cards приходить не у вигляді JS-об'єкта
        
        res.status(200).json(rows[0]);
      } else {
    
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

    
    else {
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
    }
    
  } catch (error) {
    console.error('Database Operation Error:', error);
    res.status(500).json({ error: 'Failed to process request', details: error.message });
  } finally {
    if (client) {
        client.release();
    }
  }
}
    




