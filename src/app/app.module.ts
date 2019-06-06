import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from "@angular/http";
import { NgxSmartModalModule, NgxSmartModalService } from 'ngx-smart-modal';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { BrowseComponent } from './browse/browse.component';
import { FooterComponent } from './footer/footer.component';
import { UserMenuComponent } from './user-menu/user-menu.component';

import { DeckService } from './_services/deck.service';
import { UserService } from './_services/user.service';
import { FormService } from './_services/form.service';
import { StartpageComponent } from './startpage/startpage.component';
import { CreateDeckComponent } from './create-deck/create-deck.component';
import { DeckOverviewComponent } from './deck-overview/deck-overview.component';
import { StudyDeckComponent } from './study-deck/study-deck.component';
import { UpdateDeckComponent } from './update-deck/update-deck.component';

const routes = [
  { path: 'browse-decks', component: BrowseComponent},
  { path: 'browse-decks/user/:id', component: BrowseComponent},
  { path: 'create-deck', component: CreateDeckComponent },
  { path: 'update-deck/:id', component: UpdateDeckComponent },
  { path: 'overview/:id', component: DeckOverviewComponent },
  { path: 'study/:id', component: StudyDeckComponent },
  { path: '', component: StartpageComponent},
  { path: '**', redirectTo: '/'}
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BrowseComponent,
    FooterComponent,
    UserMenuComponent,
    StartpageComponent,
    CreateDeckComponent,
    DeckOverviewComponent,
    StudyDeckComponent,
    UpdateDeckComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgxSmartModalModule.forRoot(),
    RouterModule.forRoot(routes)
  ],
  providers: [DeckService, NgxSmartModalService, UserService, FormService],
  bootstrap: [AppComponent]
})
export class AppModule { }
