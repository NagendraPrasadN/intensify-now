import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SecureRoutingModule } from './secure-routing.module';
import { SecureComponent } from './secure.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [SecureComponent],
  imports: [
    CommonModule,
    SecureRoutingModule,SharedModule
  ],
  exports:[CommonModule]
})
export class SecureModule { }
