const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const db = new Database('data.db');

// ตั้งค่าฐานข้อมูล
db.exec(`
  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    note TEXT,
    registered_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// สร้าง admin เริ่มต้น (username: admin, password: admin1234)
const existingAdmin = db.prepare('SELECT id FROM admins WHERE username = ?').get('admin');
if (!existingAdmin) {
  const hashed = bcrypt.hashSync('admin1234', 10);
  db.prepare('INSERT INTO admins (username, password) VALUES (?, ?)').run('admin', hashed);
  console.log('✅ สร้าง admin เริ่มต้น: username=admin, password=admin1234');
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'phone-reg-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 }
}));

function requireAuth(req, res, next) {
  if (req.session && req.session.adminId) return next();
  res.status(401).json({ success: false, message: 'กรุณาเข้าสู่ระบบก่อน' });
}

// ─── PUBLIC API ───────────────────────────────────────────────
// ลงทะเบียน (สำหรับประชาชนทั่วไป)
app.post('/api/register', (req, res) => {
  const { name, phone, email, note } = req.body;

  if (!name || !phone) {
    return res.json({ success: false, message: 'กรุณากรอกชื่อและเบอร์โทรศัพท์' });
  }

  const phoneClean = phone.replace(/\D/g, '');
  if (phoneClean.length < 9 || phoneClean.length > 10) {
    return res.json({ success: false, message: 'เบอร์โทรศัพท์ไม่ถูกต้อง (9-10 หลัก)' });
  }

  const duplicate = db.prepare('SELECT id FROM registrations WHERE phone = ?').get(phoneClean);
  if (duplicate) {
    return res.json({ success: false, message: 'เบอร์โทรนี้ถูกลงทะเบียนแล้ว' });
  }

  db.prepare('INSERT INTO registrations (name, phone, email, note) VALUES (?, ?, ?, ?)')
    .run(name.trim(), phoneClean, email?.trim() || '', note?.trim() || '');

  res.json({ success: true, message: 'ลงทะเบียนสำเร็จ! ขอบคุณครับ/ค่ะ' });
});

// ─── ADMIN API ────────────────────────────────────────────────
// เข้าสู่ระบบ admin
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  const admin = db.prepare('SELECT * FROM admins WHERE username = ?').get(username);

  if (!admin || !bcrypt.compareSync(password, admin.password)) {
    return res.json({ success: false, message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
  }

  req.session.adminId = admin.id;
  req.session.adminUsername = admin.username;
  res.json({ success: true, message: 'เข้าสู่ระบบสำเร็จ' });
});

// ออกจากระบบ
app.post('/api/admin/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// ตรวจสอบสถานะ login
app.get('/api/admin/me', (req, res) => {
  if (req.session && req.session.adminId) {
    res.json({ loggedIn: true, username: req.session.adminUsername });
  } else {
    res.json({ loggedIn: false });
  }
});

// ดูรายการทั้งหมด
app.get('/api/admin/registrations', requireAuth, (req, res) => {
  const { search, page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

  let query = 'SELECT * FROM registrations';
  let countQuery = 'SELECT COUNT(*) as total FROM registrations';
  const params = [];

  if (search) {
    const like = `%${search}%`;
    query += ' WHERE name LIKE ? OR phone LIKE ? OR email LIKE ?';
    countQuery += ' WHERE name LIKE ? OR phone LIKE ? OR email LIKE ?';
    params.push(like, like, like);
  }

  query += ' ORDER BY registered_at DESC LIMIT ? OFFSET ?';

  const total = db.prepare(countQuery).get(...params).total;
  const rows = db.prepare(query).all(...params, Number(limit), Number(offset));

  res.json({ success: true, data: rows, total, page: Number(page), limit: Number(limit) });
});

// ลบรายการ
app.delete('/api/admin/registrations/:id', requireAuth, (req, res) => {
  db.prepare('DELETE FROM registrations WHERE id = ?').run(req.params.id);
  res.json({ success: true, message: 'ลบสำเร็จ' });
});

// เปลี่ยนรหัสผ่าน admin
app.post('/api/admin/change-password', requireAuth, (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const admin = db.prepare('SELECT * FROM admins WHERE id = ?').get(req.session.adminId);

  if (!bcrypt.compareSync(oldPassword, admin.password)) {
    return res.json({ success: false, message: 'รหัสผ่านเดิมไม่ถูกต้อง' });
  }

  if (newPassword.length < 6) {
    return res.json({ success: false, message: 'รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร' });
  }

  const hashed = bcrypt.hashSync(newPassword, 10);
  db.prepare('UPDATE admins SET password = ? WHERE id = ?').run(hashed, req.session.adminId);
  res.json({ success: true, message: 'เปลี่ยนรหัสผ่านสำเร็จ' });
});

// Export CSV
app.get('/api/admin/export', requireAuth, (req, res) => {
  const rows = db.prepare('SELECT * FROM registrations ORDER BY registered_at DESC').all();
  const header = 'ลำดับ,ชื่อ-นามสกุล,เบอร์โทร,อีเมล,หมายเหตุ,วันที่ลงทะเบียน\n';
  const csv = header + rows.map((r, i) =>
    `${i + 1},"${r.name}","${r.phone}","${r.email || ''}","${r.note || ''}","${r.registered_at}"`
  ).join('\n');

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="registrations.csv"');
  res.send('﻿' + csv);
});

// Route pages
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 เซิร์ฟเวอร์เริ่มทำงานที่ http://localhost:${PORT}`);
  console.log(`📋 หน้าลงทะเบียน: http://localhost:${PORT}`);
  console.log(`🔐 หน้า Admin:    http://localhost:${PORT}/admin`);
  console.log(`   username: admin | password: admin1234\n`);
});
