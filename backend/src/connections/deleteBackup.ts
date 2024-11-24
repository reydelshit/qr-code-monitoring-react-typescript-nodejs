import { databaseConnection } from './DatabaseConnection';
import fs from 'fs';
import path from 'path';

type TableRow = { [key: string]: string };
type TableDataRow = Record<string, any>;

const deleteRow = async (table: string, condition: string) => {
  try {
    // Fetch rows to delete
    const rowsToDelete: TableDataRow[] = await new Promise(
      (resolve, reject) => {
        databaseConnection.query(
          `SELECT * FROM \`${table}\` WHERE ${condition}`,
          (err, results) => {
            if (err) return reject(err);
            resolve(results as TableDataRow[]);
          },
        );
      },
    );

    // Insert into deleted_records
    for (const row of rowsToDelete) {
      const deletedData = JSON.stringify(row);
      await new Promise((resolve, reject) => {
        databaseConnection.query(
          `INSERT INTO deleted_records (table_name, deleted_data) VALUES (?, ?)`,
          [table, deletedData],
          (err) => {
            if (err) return reject(err);
            resolve(true);
          },
        );
      });
    }

    // Delete rows from the original table
    await new Promise((resolve, reject) => {
      databaseConnection.query(
        `DELETE FROM \`${table}\` WHERE ${condition}`,
        (err) => {
          if (err) return reject(err);
          resolve(true);
        },
      );
    });

    console.log(`Rows deleted from ${table} and backed up.`);
  } catch (err) {
    console.error(`Error deleting rows from ${table}:`, err);
  }
};

const backupDeletedData = async () => {
  const backupDir = path.join(__dirname, 'backups');
  const backupFile = path.join(backupDir, 'deleted_data_backup.sql');

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
  }

  try {
    // Remove the existing backup file if it exists
    if (fs.existsSync(backupFile)) {
      fs.unlinkSync(backupFile);
    }

    // Fetch all deleted records
    const deletedRecords: {
      table_name: string;
      deleted_data: string;
      deleted_at: string;
    }[] = await new Promise((resolve, reject) => {
      databaseConnection.query(
        'SELECT * FROM deleted_records',
        (err, results) => {
          if (err) return reject(err);
          resolve(
            results as {
              table_name: string;
              deleted_data: string;
              deleted_at: string;
            }[],
          );
        },
      );
    });

    let backupData = '-- Backup of Deleted Data\n\n';

    for (const record of deletedRecords) {
      const { table_name, deleted_data, deleted_at } = record;
      backupData += `-- Deleted from table \`${table_name}\` at ${deleted_at}\n`;
      backupData += `INSERT INTO \`${table_name}\` VALUES ${deleted_data};\n\n`;
    }

    // Write the backup data to a file
    fs.writeFileSync(backupFile, backupData, 'utf8');
    console.log(`Backup of deleted data completed successfully: ${backupFile}`);
  } catch (err) {
    console.error('Error during backup of deleted data:', err);
  }
};

export { deleteRow, backupDeletedData };
