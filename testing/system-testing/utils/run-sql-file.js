const fs = require('fs');
const path = require('path');
const mysql = require('mysql')

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "lifelong_db",
  multipleStatements: true
});


function runSqlFile(relativeFilePath) {
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
  
            // Close the db
            db.end((endErr) => {
                if (endErr) {
                    console.error('Error closing db:', endErr);
                } else {
                    console.log('db closed.');
                }
            });
        });
    });
}

module.exports = { runSqlFile };