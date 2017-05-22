import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

/*
	Generated class for the OfflineProvider provider.

	See https://angular.io/docs/ts/latest/guide/dependency-injection.html
	for more info on providers and Angular 2 DI.
 */
@Injectable()
export class OfflineProvider {

	constructor(private sqlite: SQLite) {
		console.log('Sqlite Offline Provider');
		this.sqlite.echoTest()
			.then(() => console.log('Test finished!'))
			.catch(() => console.log('Test error!'));
	}

	storeUserInfo() {
		this.sqlite.create({
			name: 'data.db',
			location: 'default'
		});
	}
}
