import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild, Renderer2} from '@angular/core';

import {WarningDialogComponent} from "./utils/warning-dialog/warning-dialog.component";
import {Rfid} from "./utils/model/rfid.model";

import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";

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

  constructor(public _dialog: MatDialog, private _renderer: Renderer2) {
  }

  ngOnInit() {
    this.globalListenFunc = this._renderer.listen('document', 'keypress', e => {
      this.rfid?.push({
        id: this.genId(),
        code: e.charCode.toString(16),
        date: new Date()
      });
      this.openDialog(e.charCode.toString(16));

      this.dataSource.data = this.rfid;
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
    this.rfid = [];
    this.dataSource.data = [];
  }

  openDialog(code: string): void {
    this._dialog.open(WarningDialogComponent, {
      width: '800px',
      data: code
    });
  }

  ngOnDestroy() {
    // remove listener
    this.globalListenFunc();
  }
}
