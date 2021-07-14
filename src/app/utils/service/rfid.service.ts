import { Injectable } from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/database";
import {Observable} from "rxjs";
import {Rfid} from "../model/rfid.model";

@Injectable({
  providedIn: 'root'
})
export class RfidService {

  constructor(public afb: AngularFireDatabase) {
  }

  addRfid(rfid: Rfid) {
    this.afb.list('rfid/').update(rfid.id.toString(), rfid);
  }

  getRfidList(): Observable<any> {
    return this.afb.list('rfid').valueChanges();
  }

  clearData() {
    this.afb.object('rfid/').remove();
  }
}
