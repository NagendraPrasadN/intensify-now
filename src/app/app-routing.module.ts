import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthGuard } from './shared/services/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
{

 path:'auth',
 loadChildren: ()=> import('./auth/auth.module').then((m) => m.AuthModule)
},


// DEFAULT ROUTES...
{ path: 'dashboard', redirectTo: environment.secureLayoutPrefix + '/dashboard', pathMatch: 'full' },
	// SECURE ROUTES... (ACCESSIBLE ONLY AFTER AUTHENTICATION)
	{ path: environment.secureLayoutPrefix, loadChildren: () => import('./secure/secure.module').then(m => m.SecureModule), canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
