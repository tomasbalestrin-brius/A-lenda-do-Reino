import pg from 'pg';
import fs from 'fs';
import path from 'path';

// ─── Quais scripts rodar (em ordem) ──────────────────────────────────────────
const SQL_FILES = [
  'supabase_vtt.sql',
  'supabase_migration_v2.sql',
];

const CONNECTION_STRING =
  'postgresql://postgres:Gaianobria0797%40@db.ujdynisiywzpezpcusxl.supabase.co:5432/postgres';

async function run() {
  console.log('\n🔌 Conectando ao Supabase...');

  let client;
  try {
    client = new pg.Client({ connectionString: CONNECTION_STRING, ssl: { rejectUnauthorized: false } });
    await client.connect();
    console.log('✅ Conectado!\n');
  } catch (err) {
    console.error('❌ Falha ao conectar:', err.message);
    console.error('💡 Dica: execute o SQL manualmente no painel do Supabase → SQL Editor.');
    process.exit(1);
  }

  for (const file of SQL_FILES) {
    if (!fs.existsSync(file)) {
      console.log(`⚠️  Arquivo não encontrado, pulando: ${file}`);
      continue;
    }
    const sql = fs.readFileSync(file, 'utf8');
    console.log(`📄 Executando: ${file}...`);
    try {
      await client.query(sql);
      console.log(`✅ ${file} — OK\n`);
    } catch (err) {
      // IF NOT EXISTS e ALTER ... ADD COLUMN IF NOT EXISTS retornam erro se a coluna já existe
      // em versões mais antigas do Postgres — tratamos como aviso
      if (err.message.includes('already exists') || err.code === '42701' || err.code === '42P07') {
        console.log(`⚠️  ${file} — já aplicado anteriormente (ignorando)\n`);
      } else {
        console.error(`❌ Erro em ${file}:`, err.message);
        // Não abortamos — tentamos continuar com o próximo arquivo
      }
    }
  }

  console.log('🎉 Migração concluída!\n');
  await client.end();
  process.exit(0);
}

run();
