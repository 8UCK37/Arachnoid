import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import axios from 'axios';
import { UserService } from '../login/user.service';
import { Router } from '@angular/router';
import { UtilService } from '../locationmodal/util.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @ViewChild('toggleButton') toggleButton!: ElementRef;
  @ViewChild('menu') menu!: ElementRef;
  public show:boolean=false;
  public usr:any;
  public userparsed:any;
  public profileurl:any;
  public userName:any;
  isMenuOpened: boolean = false;

    constructor(public user: UserService ,private renderer: Renderer2 ,private auth: AngularFireAuth,private router: Router,private utilService : UtilService) {
    this.renderer.listen('window', 'click',(e:Event)=>{
      /**
       * Only run when toggleButton is not clicked
       * If we don't check this, all clicks (even on the toggle button) gets into this
       * section which in the result we might never see the menu open!
       * And the menu itself is checked here, and it's where we check just outside of
       * the menu and button the condition abbove must close the menu
       */
    if(this.toggleButton?.nativeElement!=null && this.menu?.nativeElement!=null){
     if(e.target !== this.toggleButton.nativeElement && e.target!==this.menu.nativeElement){
         this.show=false;
      }
    }
    });
  }


  ngOnInit(): void {
    // this.show=false;
    //
    // console.log("logged in :" ,  this.user.isLoggedIn)
    this.auth.authState.subscribe(user=>{
      if(user) {
        this.usr = localStorage.getItem('user');
        this.userparsed=JSON.parse(this.usr);
        //console.log(this.userparsed)
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
  }

  toggleMenu() {
    this.show=!this.show;
  }

  openModal(){
    console.log("nav")
    this.utilService.setModalObj({open:true})
  }
  onProfilePicError() {
    this.profileurl = this.userparsed.photoURL;
  }

  togglenav(): void {
    this.isMenuOpened = !this.isMenuOpened;
  }
}
