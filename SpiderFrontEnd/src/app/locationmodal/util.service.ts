import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  private modalObjSource = new BehaviorSubject<any>({});
  modalObj$ = this.modalObjSource.asObservable();

  constructor() { }

  setModalObj(obj: any) {
    this.modalObjSource.next(obj);
  }
}
