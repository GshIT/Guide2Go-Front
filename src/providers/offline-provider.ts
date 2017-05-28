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

	dbConnection: Promise<SQLiteObject>;

	constructor(private sqlite: SQLite) {

		console.log('Sqlite Offline Provider');

		this.sqlite.echoTest()
			.then(() => console.log('Test finished!'))
			.catch(() => console.log('Test error!'));
	}

	public initDatabase() {

		this.dbConnection = this.sqlite.create({
			name: 'data.db',
			location: 'default'
		})
			.then((db: SQLiteObject) => db)
			.catch((e) => console.log(e));

	}

	storeUserInfo() {

		this.dbConnection
			.then((db: SQLiteObject) => {
				// db.executeSql('');
				console.log("Ejecutado el sql!");
			})
			.catch((e) => console.log(e));

	}
}
