const fs = require('fs');
const path = require('path');
const mysql = require('mysql')

function createUniqueDatabaseConnection() {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '123456',
        multipleStatements: true
    });

    return connection;
}

function runSqlFile(db, relativeFilePath) {
    // Resolve the relative path to an absolute path
    const filePath = path.resolve(__dirname, relativeFilePath);
  
    // Read the SQL file
    fs.readFile(filePath, 'utf8', (err, sql) => {
        if (err) {
            console.error('Error reading SQL file:', err);
            return;
        }
  
        // Execute the SQL script
        db.query(sql, (error, results) => {
            if (error) {
                console.error('Error executing SQL script:', error);
            } else {
                console.log('SQL script executed successfully:', results);
            }
        });
    });
}

module.exports = { createUniqueDatabaseConnection, runSqlFile };