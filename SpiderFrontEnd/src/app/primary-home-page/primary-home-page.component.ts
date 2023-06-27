import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import axios from 'axios';
import { UserService } from '../login/user.service';
import { UtilService } from '../locationmodal/util.service';


@Component({
  selector: 'app-primary-home-page',
  templateUrl: './primary-home-page.component.html',
  styleUrls: ['./primary-home-page.component.css'],
})

export class PrimaryHomePageComponent implements OnInit {
  public show:boolean=true;
  public profileurl:any;
  constructor(public user: UserService ,private auth: AngularFireAuth,private renderer: Renderer2,private utilService:UtilService ) { }
  public usr:any;
  public userparsed:any;
  public userName:any;

  ngOnInit(): void {
    this.auth.authState.subscribe(user=>{
      if(user) {
        this.userparsed = user
        //console.log(this.userparsed.uid)
        axios.get('saveuser').then(res=>{
          //console.log("save user" ,res)
          axios.post('getUserInfo',{frnd_id:this.userparsed.uid}).then(res=>{
            this.profileurl=res.data.profilePicture;
            this.userName=res.data.name;
           //console.log(res.data);
         }).catch(err=>console.log(err))
        }).catch(err =>console.log(err))

      }
    })

    this.utilService.modalObj$.subscribe((modalData:any)=>{
      if(modalData.open){
        console.log("true")
      }else{
        console.log("false")
      }
    })
   }

  toggleMenu() {
    this.show=!this.show;
  }

  onProfilePicError() {
    this.profileurl = this.userparsed?.photoURL;
  }
  openModal(){
    console.log("here")
    this.utilService.setModalObj({open:true})
  }
}


