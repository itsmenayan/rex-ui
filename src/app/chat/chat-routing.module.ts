import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OneshopComponent } from './chat-dialog/oneshop/oneshop.component';
import { OneappComponent } from './chat-dialog/oneapp/oneapp.component';

const routes: Routes = [
  { path: 'oneShop', component: OneshopComponent},
  { path: 'oneApp', component: OneappComponent},
  { path: '',
  redirectTo: '/oneShop',
  pathMatch: 'full'
},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class ChatRoutingModule { }
