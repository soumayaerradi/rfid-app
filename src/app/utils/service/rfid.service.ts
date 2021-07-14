import {Injectable} from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/database";
import {Observable} from "rxjs";
import {Rfid} from "../model/rfid.model";

@Injectable({
  providedIn: 'root'
})
export class RfidService {

  constructor(private _fireDatabase: AngularFireDatabase) {
  }

  addRfid(rfid: Rfid) {
    this._fireDatabase.list('rfid/').update(rfid.id.toString(), rfid);
  }

  getRfidList(): Observable<any> {
    return this._fireDatabase.list('rfid').valueChanges();
  }

  clearData() {
    this._fireDatabase.object('rfid/').remove();
  }
}
