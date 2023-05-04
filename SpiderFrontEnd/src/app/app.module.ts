import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PrimaryHomePageComponent } from './primary-home-page/primary-home-page.component';
import { LoginComponent } from './login/login.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from '../environments/environment';
import { IonicModule } from '@ionic/angular';
import { ChatPageComponent } from './chat-page/chat-page.component';
import { ChatServicesService } from './chat-page/chat-services.service';
import { NavbarComponent } from './navbar/navbar.component';


import { MatAutocompleteModule} from '@angular/material/autocomplete';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip'
import { TypeaheadModule} from 'ngx-bootstrap/typeahead';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



import { TagInputModule } from 'ngx-chips';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
@NgModule({
  declarations: [
      AppComponent,
      PrimaryHomePageComponent,
      LoginComponent,
      ChatPageComponent,
      NavbarComponent,
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    IonicModule,
    MatAutocompleteModule,
    FormsModule,
    TooltipModule.forRoot(),
    TypeaheadModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    TagInputModule,
    ReactiveFormsModule,
    PickerModule,
    ButtonModule,
    DialogModule,
    ProgressSpinnerModule,
    CarouselModule.forRoot()
  ],
  providers: [
    ChatServicesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
