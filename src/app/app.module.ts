import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from "@angular/common/http";
import { InlineSVGModule } from 'ng-inline-svg';
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from "@angular/material";
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { Ng5SliderModule } from 'ng5-slider';

import { ColorPickerModule } from 'ngx-color-picker';
import { ClipboardModule } from 'ngx-clipboard';
import { CardModule } from 'ngx-card/ngx-card';

import { SiteLayoutComponent } from './layout/site-layout/site-layout.component';
import { HeaderComponent } from './layout/header/header.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { EditlayoutComponent } from './icontool/editlayout/editlayout.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { IconComponent } from './icontool/icon/icon.component';
import { BackgroundComponent } from './icontool/background/background.component';
import { IconeditComponent } from './icontool/iconedit/iconedit.component';
import { WhiteboardComponent } from './icontool/whiteboard/whiteboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogComponent } from './layout/dialog/dialog.component';
import { FavoriteComponent } from './favorite/favorite.component';
import { TransformComponent } from './icontool/transform/transform.component';
import { UpgradeComponent } from './upgrade/upgrade.component';
import { LogoutComponent } from './logout/logout.component';
import { VerificationComponent } from './layout/verification/verification.component';
import { PlansComponent } from './plans/plans.component';
import { SuccessComponent } from './layout/success/success.component';
import { ToastrModule } from 'ngx-toastr';
import { AnglepickerComponent } from './layout/anglepicker/anglepicker.component';
@NgModule({
  declarations: [
    AppComponent,
    SiteLayoutComponent,
    HeaderComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    EditlayoutComponent,
    IconComponent,
    BackgroundComponent,
    IconeditComponent,
    WhiteboardComponent,
    DialogComponent,
    FavoriteComponent,
    TransformComponent,
    UpgradeComponent,
    LogoutComponent,
    VerificationComponent,
    PlansComponent,
    SuccessComponent,
    AnglepickerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AngularFontAwesomeModule,
    InlineSVGModule,
    MatSliderModule,
    MatCheckboxModule,
    MatDialogModule,
    MatBottomSheetModule,
    MatSelectModule,
    FormsModule,
    BrowserAnimationsModule,
    ColorPickerModule,
    ClipboardModule,
    CardModule,
    ToastrModule.forRoot(),
    Ng5SliderModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents:[DialogComponent, TransformComponent]
})
export class AppModule { }
