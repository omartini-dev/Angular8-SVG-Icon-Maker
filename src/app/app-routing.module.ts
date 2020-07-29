import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component'
import { EditlayoutComponent } from './icontool/editlayout/editlayout.component'
import { LoginComponent } from './login/login.component'
import { LogoutComponent } from './logout/logout.component'
import { SignupComponent } from './signup/signup.component'
import { VerificationComponent } from './layout/verification/verification.component'
import { SuccessComponent } from './layout/success/success.component'
import { FavoriteComponent } from './favorite/favorite.component'
import { UpgradeComponent } from './upgrade/upgrade.component'
import { PlansComponent } from './plans/plans.component'
import { AuthGuard } from './helpers/auth.guard';

const routes: Routes = [{
	path:'',
	component: HomeComponent
},{
	path:'editor',
	component: EditlayoutComponent,
	canActivate: [AuthGuard]
},{
	path:'favorite',
	component: FavoriteComponent,
	canActivate: [AuthGuard]
},{
	path:'upgrade',
	component: UpgradeComponent,
	canActivate: [AuthGuard]
},{
	path:'plans',
	component: PlansComponent,
	canActivate: [AuthGuard]
},{
	path:'login',
	component: LoginComponent
},{
	path:'signup',
	component: SignupComponent
},{
	path:'logout',
	component: LogoutComponent
},{
	path:'waiting',
	component: VerificationComponent
},{
	path:'success',
	component: SuccessComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
