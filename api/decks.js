// api/decks.js - ВИПРАВЛЕНИЙ КОД ЗІ СПРОЩЕНИМ SSL

import { Pool } from 'pg'; 

// Глобальне вимкнення перевірки сертифікатів (покладаємося на змінну Vercel)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const pool = new Pool({
  connectionString: process.env.AIVEN_POSTGRES_URL, 
  max: 1, 
  idleTimeoutMillis: 0,
});

export default async function handler(req, res) {
  let client;
  try {
    client = await pool.connect();
    const { method } = req;
    const id = req.query.id; // ID береться з query для GET/PUT/DELETE

    // --- CREATE (POST) ---
    if (method === 'POST') {
      const { title, description, cards } = req.body;
      
      const newDeck = await client.query(
        `INSERT INTO decks (title, description, cards, created_at, updated_at) 
         VALUES ($1, $2, $3, NOW(), NOW()) 
         RETURNING *`,
        [title, description, JSON.stringify(cards)] 
      );
      res.status(201).json(newDeck.rows[0]);
      return; // !!! ОБОВ'ЯЗКОВО ДЛЯ ЗАВЕРШЕННЯ
    }

    // --- READ (GET) ---
    else if (method === 'GET') {
      if (id) {
        // GET одного набору
        const { rows } = await client.query('SELECT * FROM decks WHERE id = $1', [id]);
        
        if (rows.length === 0) return res.status(404).json({ error: 'Deck not found' });
        
        res.status(200).json(rows[0]);
        return; // !!! ОБОВ'ЯЗКОВО ДЛЯ ЗАВЕРШЕННЯ
      } else {
        // GET усіх наборів
        const { rows } = await client.query('SELECT * FROM decks ORDER BY updated_at DESC');
        res.status(200).json(rows);
        return; // !!! ОБОВ'ЯЗКОВО ДЛЯ ЗАВЕРШЕННЯ
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
      return; // !!! ОБОВ'ЯЗКОВО ДЛЯ ЗАВЕРШЕННЯ
    }

    // --- DELETE (DELETE) ---
    else if (method === 'DELETE') {
      await client.query('DELETE FROM decks WHERE id = $1', [id]);
      res.status(204).end(); // No Content
      return; // !!! ОБОВ'ЯЗКОВО ДЛЯ ЗАВЕРШЕННЯ
    }

    // --- METHOD NOT ALLOWED (Інші методи) ---
    else {
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
      return;
    }

  } catch (error) {
    // ВАЖЛИВО: Помилки бази даних будуть тут
    console.error('Database Operation Error:', error);
    res.status(500).json({ error: 'Failed to process request', details: error.message });
  } finally {
    if (client) {
      client.release();
    }
  }
}
🛠️ Наступні Кроки





