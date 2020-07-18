import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LnrGraphicsComponent } from './graphics/lnr-graphics/lnr-graphics.component';

@NgModule({
  declarations: [
    AppComponent,
    LnrGraphicsComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
