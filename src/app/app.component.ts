import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild, Renderer2} from '@angular/core';

import {WarningDialogComponent} from "./utils/warning-dialog/warning-dialog.component";
import {RfidService} from "./utils/service/rfid.service";
import {Rfid} from "./utils/model/rfid.model";

import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatDialog, MatDialogState} from "@angular/material/dialog";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'rfid-web';
  rfid: Rfid[] = [];
  displayedColumns = ['id', 'code', 'date'];
  dataSource: MatTableDataSource<Rfid> = new MatTableDataSource<Rfid>();
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  globalListenFunc: Function | any;
  dialogRef: any;

  constructor(public _dialog: MatDialog, private _renderer: Renderer2, private _rfidService: RfidService) {
  }

  ngOnInit() {
    this.getRfidList();
    this.readData();
  }

  getRfidList(): void {
    this._rfidService.getRfidList().subscribe(
      res => {
        if (this.rfid.length && (res.length > this.rfid.length)) {
          if (this.dialogRef?.getState() === MatDialogState.OPEN) {
            this.dialogRef.componentInstance.code = res[res.length - 1].code;
          } else {
            this.openDialog(res[res.length - 1].code);
          }
        }
        this.rfid = res;
        this.dataSource.data = this.rfid;
      }
    );
  }

  readData(): void {
    this.globalListenFunc = this._renderer.listen('document', 'keypress', e => {
      this._rfidService.addRfid({
        id: this.genId(),
        code: e.charCode.toString(16),
        date: new Date()
      });
    });
  }

  genId(): number {
    return this.rfid.length > 0 ? Math.max(...this.rfid.map(x => x.id)) + 1 : 1
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.sort.sort({id: 'id', start: 'desc', disableClear: false});
    });

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  clearData(): void {
    this._rfidService.clearData();
  }

  openDialog(code: string): void {
    this.dialogRef = this._dialog.open(WarningDialogComponent, {
      width: '800px',
      data: code
    });
  }

  ngOnDestroy() {
    // remove listener
    this.globalListenFunc();
  }
}
