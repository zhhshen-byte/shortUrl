import mysql from 'mysql';
import dbConfig from '../config/db';

const pool = mysql.createPool(dbConfig);

const query = (sql: string) => {
    return new Promise<any>((resolve, reject) => {
        pool.getConnection((error, connection) => {
            if (error) {
                reject(error);
            } else {
                connection.query(sql, (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                    connection.release();
                })
            }
        });
    });
};

export default query;
