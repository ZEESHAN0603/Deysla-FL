import fs from 'fs';
import path from 'path';
import { getMysqlPool } from '../src/server/db/mysql.ts';

async function main() {
  const pool = await getMysqlPool();
  if (!pool) {
    console.error('MySQL pool unavailable');
    process.exit(1);
  }

  const conn = await pool.getConnection();
  try {
    // 1. Complaints
    const complaintsFile = path.resolve('data/db/complaints.json');
    if (fs.existsSync(complaintsFile)) {
      const complaints = JSON.parse(fs.readFileSync(complaintsFile, 'utf-8'));
      let cCount = 0;
      for (const c of complaints) {
        const [res]: [any, any] = await conn.query(
          `INSERT IGNORE INTO cms_complaints (id, name, email, contact, company_name, message, type, status, notes, submitted_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            c.id,
            c.name,
            c.email,
            c.contact || '',
            c.companyName || '',
            c.message,
            c.type || 'Contact Enquiry',
            c.status || 'New',
            c.notes || '',
            c.submittedAt ? new Date(c.submittedAt) : new Date(),
            c.updatedAt ? new Date(c.updatedAt) : new Date(),
          ]
        );
        if (res.affectedRows > 0) cCount++;
      }
      console.log(`Synced complaints to MySQL: ${cCount} new records inserted.`);
    }

    // 2. Quotes
    const quotesFile = path.resolve('data/db/quotes.json');
    if (fs.existsSync(quotesFile)) {
      const quotes = JSON.parse(fs.readFileSync(quotesFile, 'utf-8'));
      let qCount = 0;
      for (const q of quotes) {
        const [res]: [any, any] = await conn.query(
          `INSERT IGNORE INTO cms_quotes (id, name, email, phone, company_name, city, project_timeline, notes, items, status, submitted_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            q.id,
            q.name,
            q.email,
            q.phone,
            q.companyName,
            q.city,
            q.projectTimeline,
            q.notes || '',
            JSON.stringify(q.items || []),
            q.status || 'Pending',
            q.submittedAt ? new Date(q.submittedAt) : new Date(),
            q.updatedAt ? new Date(q.updatedAt) : new Date(),
          ]
        );
        if (res.affectedRows > 0) qCount++;
      }
      console.log(`Synced quotes to MySQL: ${qCount} new records inserted.`);
    }

    // 3. Audit logs
    const auditFile = path.resolve('data/db/audit_logs.json');
    if (fs.existsSync(auditFile)) {
      const logs = JSON.parse(fs.readFileSync(auditFile, 'utf-8'));
      let lCount = 0;
      for (const l of logs) {
        const [res]: [any, any] = await conn.query(
          `INSERT IGNORE INTO cms_audit_logs (id, timestamp, user, action, entity, entity_id, details)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            l.id,
            l.timestamp ? new Date(l.timestamp) : new Date(),
            l.user || 'admin',
            l.action,
            l.entity,
            l.entityId,
            l.details || '',
          ]
        );
        if (res.affectedRows > 0) lCount++;
      }
      console.log(`Synced audit logs to MySQL: ${lCount} new records inserted.`);
    }

    // Print final counts
    const [[{ cTotal }]]: [any, any] = await conn.query('SELECT COUNT(*) as cTotal FROM cms_complaints');
    const [[{ qTotal }]]: [any, any] = await conn.query('SELECT COUNT(*) as qTotal FROM cms_quotes');
    const [[{ aTotal }]]: [any, any] = await conn.query('SELECT COUNT(*) as aTotal FROM cms_audit_logs');
    console.log(`Final MySQL counts -> Complaints: ${cTotal}, Quotes: ${qTotal}, Audit Logs: ${aTotal}`);
  } finally {
    conn.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error('Sync failed:', err);
  process.exit(1);
});
