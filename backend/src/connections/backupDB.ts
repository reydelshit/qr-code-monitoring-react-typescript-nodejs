import { databaseConnection } from './DatabaseConnection';
import fs from 'fs';
import path from 'path';

type TableRow = { [key: string]: string };
type TableDataRow = Record<string, any>;

const backupDatabase = async () => {
  const backupDir = path.join(__dirname, 'backups');
  const backupFile = path.join(backupDir, 'backup.sql');

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
  }

  try {
    if (fs.existsSync(backupFile)) {
      fs.unlinkSync(backupFile);
    }

    const tables: TableRow[] = await new Promise((resolve, reject) => {
      databaseConnection.query('SHOW TABLES', (err, results) => {
        if (err) return reject(err);
        resolve(results as TableRow[]);
      });
    });

    let backupData = '';

    for (const tableRow of tables) {
      const table = Object.values(tableRow)[0];

      const tableSchema: string = await new Promise((resolve, reject) => {
        databaseConnection.query(
          `SHOW CREATE TABLE \`${table}\``,
          (err, results: { 'Create Table': string }[]) => {
            if (err) return reject(err);
            resolve(results[0]['Create Table']);
          },
        );
      });

      backupData += `-- Schema for table \`${table}\`\n`;
      backupData += `${tableSchema};\n\n`;

      const tableData: TableDataRow[] = await new Promise((resolve, reject) => {
        databaseConnection.query(
          `SELECT * FROM \`${table}\``,
          (err, results) => {
            if (err) return reject(err);
            resolve(results as TableDataRow[]);
          },
        );
      });

      if (tableData.length > 0) {
        backupData += `-- Data for table \`${table}\`\n`;
        for (const row of tableData) {
          const values = Object.values(row)
            .map((value) => (value === null ? 'NULL' : `'${value}'`))
            .join(', ');

          console.log(`Inserting row into backup: ${values}`);

          backupData += `INSERT INTO \`${table}\` VALUES (${values});\n`;
        }
        backupData += '\n';
      } else {
        console.log(`No data found for table ${table}`);
      }
    }

    fs.writeFileSync(backupFile, backupData, 'utf8');
    console.log(`Backup completed successfully: ${backupFile}`);
  } catch (err) {
    console.error('Error during backup:', err);
  }
};

export { backupDatabase };
