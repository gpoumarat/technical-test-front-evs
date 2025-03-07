import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { AppComponent } from './app.component';


const routes: Routes = [
  { path: '', redirectTo: 'exams', pathMatch: 'full' },
  { 
    path: 'exams',
    loadComponent: () => import('./components/exam-list/exam-list.component').then(m => m.ExamListComponent)
  },
  {
    path: 'new-exam',
    loadComponent: () => import('./components/exam-form/exam-form.component').then(m => m.ExamFormComponent)
  }
];

registerLocaleData(localeFr);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'fr-FR' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }