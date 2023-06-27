import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { take } from 'rxjs/internal/operators/take';
import { UtilService } from './util.service';
@Component({
  selector: 'app-locationmodal',
  templateUrl: './locationmodal.component.html',
  styleUrls: ['./locationmodal.component.css']
})
export class LocationmodalComponent implements OnInit {
  @ViewChild('modal') modal!:TemplateRef<any>;
  isOpen:boolean = false;
  public modalRef?: BsModalRef;
  constructor(private modalService: BsModalService,private utilService : UtilService) { }

  ngOnInit(): void {
    this.modalService.onHide.pipe(take(1)).subscribe(()=>{
      // alert("close")
      // this.utilsServiceService.modalObjSource.next({open:false })
      this.isOpen = false
    })

    this.utilService.modalObj$.subscribe((modalData:any)=>{
      console.log(modalData)

    })

  }
  openModal(template: TemplateRef<any>) {
    console.log("open")
    this.modalRef = this.modalService.show(template,
      );
  }

  closeModal(template: TemplateRef<any>){
    this.modalService.hide()
    this.isOpen = false
  }
}
