import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from 'src/environments/environment';

const routes: Routes = [
{
 path:'auth',
 loadChildren: ()=> import('./auth/auth.module').then((m) => m.AuthModule)
},

// DEFAULT ROUTES...
//{ path: '', redirectTo: environment.secureLayoutPrefix + '/dashboard', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
