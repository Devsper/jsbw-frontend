import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

import { DeckService } from "../_services/deck.service";
import { Deck } from "../_models/Deck";

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css']
})
export class BrowseComponent implements OnInit, OnDestroy {

  /**
   * BrowseComponent is used for displaying 
   * both public and user specifik decks
   */

  // Initialize variables
  decks = [];
  id;
  title = "Bläddra kortlekar";
  subscription;

  // Constructs variables from modules and services
  constructor(private deckService: DeckService,
              private activatedRoute: ActivatedRoute){}

  // Lifecycle hook fires after variables has been initialized/constructed
  ngOnInit() {

    // Fetch public/user decks depending on id is present or not 
    this.activatedRoute.params.subscribe((params) => {

        if(params.id){
          this.loadAllUserDecks(params.id);
        }else{
          this.loadAllPublicDecks();
        }
      });
    
    // Subscribes to a Subject, will fire when 'decksFetched' in service changes
    this.subscription = this.deckService.decksFetched.subscribe(
      () => {
        // Adds decks from service to component
        this.decks = this.deckService.decks;
      }
    );
  }

  // Removes subscription when leaving component, prevents memory leaks
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }


 public loadAllPublicDecks(){
    this.deckService.getAllPublicDecks();
 }

 public loadAllUserDecks(id){
   this.deckService.getAllUserDecks(id);
 }
 

}
