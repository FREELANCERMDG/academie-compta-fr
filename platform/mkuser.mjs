// Crée ou réinitialise un compte apprenant. Usage: node mkuser.mjs <email> <motdepasse> [role]
import { openDB, hashPassword, rid } from './lib.mjs';
const db = openDB();
const email = (process.argv[2] || '').toLowerCase();
const pw = process.argv[3] || 'Compta2026!';
const role = process.argv[4] || 'apprenant';
if (!email) { console.log('Email requis'); process.exit(1); }
const { hash, salt } = hashPassword(pw);
const ex = db.prepare('SELECT id FROM users WHERE email=?').get(email);
if (ex) {
  db.prepare('UPDATE users SET pass_hash=?, pass_salt=?, twofa=0, totp_secret=NULL, email_verifie=1, role=? WHERE email=?').run(hash, salt, role, email);
  console.log('Compte MIS A JOUR :', email, '| role:', role);
} else {
  db.prepare('INSERT INTO users(id,nom,prenom,email,tel,niveau_etudes,diplome_bac2,niveau_intellectuel,pass_hash,pass_salt,email_verifie,role,cree_le) VALUES(?,?,?,?,?,?,1,?,?,?,1,?,?)')
    .run(rid(8), 'RANDRIAMANANTSOA', 'Anthony', email, '+261 32 73 622 59', 'BAC+5 (master)', 'Avancé', hash, salt, role, new Date().toISOString());
  console.log('Compte CREE :', email, '| role:', role);
}
console.log('Mot de passe :', pw);
