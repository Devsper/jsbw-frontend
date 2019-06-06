import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import autosize from "autosize";

import { DeckService } from "../_services/deck.service";

@Component({
  selector: 'app-deck-overview',
  templateUrl: './deck-overview.component.html',
  styleUrls: ['./deck-overview.component.css']
})
export class DeckOverviewComponent implements OnInit, OnDestroy {

  /**
   * DeckOverviewComponent is used 
   * for showing an existing deck
   */

  // Initializes variables
  title = "Översikt av kortlek";
  deck;
  isUsersDeck = false;
  subscription;

  // Constructs variables from modules and services
  constructor(private deckService: DeckService,
              private activatedRoute: ActivatedRoute) {}

  // Lifecycle hook fires after variables has been initialized/constructed
  ngOnInit() {

    // Only loads deck if there is a id parameter present
    this.activatedRoute.params.subscribe((params) => {

        if(params.id){
          this.loadSingleDeck(params.id);
        }
      });

    // Subscribes to a Subject, will fire when 'deckFetched' in service changes
    this.subscription = this.deckService.deckFetched.subscribe(() => {

        // Fetches deck from service
        this.deck = this.deckService.decks;
        
        // Checks if current user has created deck
        if(this.deck.createdBy == localStorage.userId){
          this.isUsersDeck = true;
        }
      }
    );
  }

  // Removes subscription when leaving component, prevents memory leaks
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  /**
   * Fetches a single deck from id
   * 
   * @param {number} id - Id of deck to fetch
   */
  public loadSingleDeck(id){

    this.deckService.getDeck(id);
  }

  /**
   * Activates autosizing for focused input fields
   * 
   * @param {HTMLElement} input - Input field to add autosize to
   */
  activateAutosize(input){

    // Adds autosize when user focuses input 
    autosize(input);    
}

}
