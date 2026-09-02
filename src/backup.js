// Data export helpers for the admin dashboard's backup feature.
// Produces two artifacts from the same in-memory data:
//   1. A full-fidelity JSON snapshot (safe restore point, re-importable to Firestore by hand).
//   2. A Supabase-ready .sql file: one Postgres table per Firestore collection,
//      each row storing its document as JSONB so no field-by-field schema has to be
//      guessed from Firestore's schemaless documents. Re-running the same file is
//      safe (ON CONFLICT upserts).

const COLLECTIONS = ['products', 'users', 'transactions', 'monthly_reports', 'settings'];

// Firestore Timestamps/Dates need to become plain ISO strings before they can be
// serialized to JSON or embedded in SQL.
function serializable(value) {
  return JSON.parse(JSON.stringify(value, (_key, val) => {
    if (val instanceof Date) return val.toISOString();
    if (val?.toDate instanceof Function) return val.toDate().toISOString();
    return val;
  }));
}

function escapeSQLString(str) {
  return str.replace(/'/g, "''");
}

function buildBackupData({ products, users, transactions, monthlyReports, settings }) {
  return {
    exportedAt: new Date().toISOString(),
    products: serializable(products || []),
    users: serializable(users || []),
    transactions: serializable(transactions || []),
    monthly_reports: serializable(monthlyReports || []),
    // settings is a single document in Firestore; keep it as one row keyed 'main'
    settings: [{ id: 'main', ...serializable(settings || {}) }]
  };
}

export function buildBackupJSON(data) {
  return JSON.stringify(buildBackupData(data), null, 2);
}

export function buildSupabaseSQL(data) {
  const backup = buildBackupData(data);
  const lines = [
    '-- Kamila Mart data backup — generated for import into Supabase (Postgres).',
    `-- Exported at: ${backup.exportedAt}`,
    '--',
    '-- Each Firestore collection becomes one table with the full document stored',
    '-- as JSONB, so no data is lost to an assumed flat schema. Query fields with',
    "-- e.g. `data->>'name'` or `(data->>'price')::numeric` once imported.",
    '-- Safe to re-run: existing rows are upserted by id.',
    ''
  ];

  for (const collectionName of COLLECTIONS) {
    const rows = backup[collectionName] || [];
    const tableName = collectionName;

    lines.push(`CREATE TABLE IF NOT EXISTS ${tableName} (`);
    lines.push('  id text PRIMARY KEY,');
    lines.push('  data jsonb NOT NULL,');
    lines.push('  created_at timestamptz NOT NULL DEFAULT now()');
    lines.push(');');
    lines.push('');

    if (rows.length === 0) {
      lines.push(`-- No ${tableName} rows to import.`);
      lines.push('');
      continue;
    }

    lines.push(`INSERT INTO ${tableName} (id, data) VALUES`);
    const valueLines = rows.map((row, index) => {
      const { id, ...rest } = row;
      const rowId = id != null ? String(id) : `row_${index}`;
      const json = JSON.stringify(rest);
      return `  ('${escapeSQLString(rowId)}', '${escapeSQLString(json)}'::jsonb)`;
    });
    lines.push(valueLines.join(',\n'));
    lines.push(`ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data;`);
    lines.push('');
  }

  return lines.join('\n');
}

export function downloadTextFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
