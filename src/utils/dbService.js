import {enablePromise, openDatabase, SQLiteDatabase} from 'react-native-sqlite-storage';
import {logi} from "./logutil";

enablePromise(true)
const lifeRecordTableName = "liferecord" // 记录生活的表


export const getDBConnection = async () => {
    return openDatabase({name: 'yihao.db', location: 'default'});
}

// 创建生活记录的数据库表
export const createLifeRecordTable = async (db) => {
    // 创建数据库的表
    // 插入name，就是类型名称，json是数据的json值，time是时间戳, typeId是类型id
    const query = `CREATE TABLE IF NOT EXISTS ${lifeRecordTableName}(
         rowid integer PRIMARY KEY autoincrement, name TEXT NOT NULL, json TEXT, time bigint, typeId integer
    );`;

    await db.executeSql(query);
}

// 获取数据列表
export const getDataList = async (db) => {
    try {
        const dataList = [];
        const results = await db.executeSql(`SELECT rowid, name, json, time FROM ${lifeRecordTableName}`);
        results.forEach(result => {
            for (let index = 0; index < result.rows.length; index++) {
                dataList.push(result.rows.item(index))
            }
        });
        return dataList;
    } catch (error) {
        logi(error);
        throw Error('Failed to get todoItems !!!');
    }
};

// 插入单条数据
export const insertData = async (db, data, dataStr) => {
    // const insertQuery = `INSERT INTO ${lifeRecordTableName} (name, time, json) values ("${data.name}", ${data.time}, "${JSON.stringify(data)}")`
    const insertQuery = `INSERT INTO ${lifeRecordTableName} (name, time, json) values ("${data.name}", ${data.time}, "${dataStr}")`
    return db.executeSql(insertQuery)
}

// 保存列表数据
export const saveDataList = async (db, dataList) => {
    const insertQuery =
        `INSERT OR REPLACE INTO ${lifeRecordTableName}(rowid, name) values` +
        dataList.map(i => `(${i.id}, '${i.name}')`).join(',');

    return db.executeSql(insertQuery);
};

// 删除数据
export const deleteDataByRowId = async (db, id) => {
    const deleteQuery = `DELETE from ${lifeRecordTableName} where rowid = ${id}`;
    await db.executeSql(deleteQuery);
};

// 根据时间删除数据
export const deleteDataByTime = async (db, time) => {
    const deleteQuery = `DELETE from ${lifeRecordTableName} where time = ${time}`;
    await db.executeSql(deleteQuery);
};

// 删除数据表
export const deleteTable = async (db) => {
    const query = `drop table ${lifeRecordTableName}`;

    await db.executeSql(query);
};