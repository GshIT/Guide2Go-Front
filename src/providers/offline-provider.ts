import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

/*
	Generated class for the OfflineProvider provider.

	See https://angular.io/docs/ts/latest/guide/dependency-injection.html
	for more info on providers and Angular 2 DI.
 */
@Injectable()
export class OfflineProvider {

	dbConnect: Promise<SQLiteObject>;

	constructor(private sqlite: SQLite) {

		console.log('Sqlite Offline Provider');

		this.sqlite.echoTest()
			.then(() => console.log('Test finished!'))
			.catch(() => console.log('Test error!'));
	}

	public initDatabase() {

		let dbc = this.sqlite.create({
			name: 'data.db',
			location: 'default'
		});

		this.dbConnect = dbc;
		dbc.then(this.initUserTable.bind(this));
		dbc.then(this.initGuideTable.bind(this))
		dbc.then(this.initUserGuideTable.bind(this))
		dbc.catch((e) => console.log(e));
	}

	initUserTable(db: SQLiteObject) {

		let sql = "";
		sql += 'CREATE TABLE IF NOT EXISTS USERS(';
		sql += 'ID INTEGER PRIMARY KEY AUTOINCREMENT,';
		sql += 'TYPE INTEGER,';
		sql += 'PAGE INTEGER,';
		sql += 'REFERER INTEGER,';
		sql += 'NAME VARCHAR(255) NOT NULL,';
		sql += 'EMAIL VARCHAR(255) NOT NULL,';
		sql += 'DOLLARS DECIMAL(32, 2)';
		sql += ');';

		db.executeSql(sql, {});
		console.log("Created Users Table!");

		return db;
	}

	initGuideTable(db: SQLiteObject) {

		let sqlQuerys = [];

		// Un poco feo, se pueden mover 
		// estos querys a otro archivo...

		let sql = "";
		sql += 'CREATE TABLE IF NOT EXISTS ZONES(';
		sql += 'ID INTEGER PRIMARY KEY AUTOINCREMENT,';
		sql += 'NAME VARCHAR(255) NOT NULL,';
		sql += 'POLYGON VARCHAR(255) NOT NULL';
		sql += ');';
		sqlQuerys.push(sql);

		sql = "";
		sql += 'CREATE TABLE IF NOT EXISTS GUIDES('
		sql += 'ID INTEGER PRIMARY KEY AUTOINCREMENT,'
		sql += 'ZONE_ID INTEGER NOT NULL,'
		sql += 'LANG CHAR(20),'
		sql += 'FOREIGN KEY (ZONE_ID) REFERENCES ZONES(ID)'
		sql += ');'
		sqlQuerys.push(sql);

		sql = "";
		sql += 'CREATE TABLE IF NOT EXISTS SUB_ZONES(';
		sql += 'ID INTEGER PRIMARY KEY AUTOINCREMENT,';
		sql += 'ZONE_ID INTEGER NOT NULL,';
		sql += 'NAME VARCHAR(255) NOT NULL,';
		sql += 'POLYGON VARCHAR(255) NOT NULL,';
		sql += 'FOREIGN KEY (ZONE_ID) REFERENCES ZONES(ID)';
		sql += ');';
		sqlQuerys.push(sql);

		sql = "";
		sql += 'CREATE TABLE IF NOT EXISTS SPOTS(';
		sql += 'ID INTEGER PRIMARY KEY AUTOINCREMENT,';
		sql += 'SUB_ZONE_ID INTEGER NOT NULL,';
		sql += 'CATEGORY VARCHAR(255) NOT NULL,';
		sql += 'NAME VARCHAR(255) NOT NULL,';
		sql += 'DESCRIPTION TEXT,';
		sql += 'POINT VARCHAR(255) NOT NULL,';
		sql += 'FOREIGN KEY (SUB_ZONE_ID) REFERENCES SUB_ZONES(ID)';
		sql += ');';
		sqlQuerys.push(sql);

		sql = "";
		sql += 'CREATE TABLE IF NOT EXISTS AUDIOS(';
		sql += 'ID INTEGER PRIMARY KEY AUTOINCREMENT,';
		sql += 'SPOT_ID INTEGER NOT NULL,';
		sql += 'LANG CHAR(20),';
		sql += 'PATH VARCHAR(255) NOT NULL,';
		sql += 'FOREIGN KEY (SPOT_ID) REFERENCES SPOTS(ID)';
		sql += ');';

		console.log(sqlQuerys);

		db.sqlBatch(sqlQuerys);
		console.log("Created Guide Tables!");

		return db;
	}

	initUserGuideTable(db: SQLiteObject) {

		let sql = "";
		sql += 'CREATE TABLE IF NOT EXISTS USER_GUIDE(';
		sql += 'USER_ID INTEGER NOT NULL,';
		sql += 'GUIDE_ID INTEGER NOT NULL,';
		sql += 'FOREIGN KEY (USER_ID) REFERENCES USERS(ID),';
		sql += 'FOREIGN KEY (GUIDE_ID) REFERENCES GUIDES(ID),';
		sql += 'PRIMARY KEY (USER_ID, GUIDE_ID)';
		sql += ');';

		db.executeSql(sql, {});
		console.log("Created User relationship with Guide");

		return db;
	}
}
