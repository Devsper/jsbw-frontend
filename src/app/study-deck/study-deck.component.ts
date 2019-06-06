import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

import { DeckService } from "../_services/deck.service";

@Component({
  selector: 'app-study-deck',
  templateUrl: './study-deck.component.html',
  styleUrls: ['./study-deck.component.css']
})
export class StudyDeckComponent implements OnInit {

  /**
   *  StudyDeckComponent handles the 
   *  study element of a specified deck
   */

  flip = false;
  deck;
  numOfCards;
  subscription;

  // Constructs variables from modules and services
  constructor(private deckService: DeckService,
              private activatedRoute: ActivatedRoute) { }

  // Lifecycle hook fires after variables has been initialized/constructed    
  ngOnInit() {

    // Only loads deck if there is a id parameter present
    this.activatedRoute.params.subscribe((params) => {

        if(params.id){
          this.loadSingleDeck(params.id);
        }
      });

      // Subscribes to a Subject, will fire when 'deckFetched' in service changes
      this.subscription = this.deckService.deckFetched.subscribe(
        () => {
          // Fetches deck from service
          this.deck = this.deckService.decks;
          this.numOfCards = this.deck.cards.length;
        }
      );

  }

  public loadSingleDeck(id){

    this.deckService.getDeck(id);
  }

  toggleClass(){
    // Toggles variable true/false
    this.flip = !this.flip;
  }

  /**
   * Shows previous card in deck
   */
  previousCard(){

    // If cards are moving prevent click
    if(this.checkClasses()){
      return
    }
    
    // No previous cards prevents click
    if(document.getElementsByClassName("stack-prev").length == 0){
      return
    }
    
    let prev = document.getElementsByClassName("stack-prev");
    let count = prev.length;
    // Previous card in stack, fetches the last card in array, applies "transitional class" for movement to the current position
    prev[count-1].className = "prev-move-right";
    
    let current = document.getElementsByClassName("current-card");
    // Current flashcard, Applies "transitional class" for movement to "next stack" position
    current[0].className = "current-move-right";
    
    // Changes classes after the CSS-transition (0.2ms) has finished
     setTimeout(function(){ 
      
      // Previous card is now the current card
      let oldPrev = document.getElementsByClassName("prev-move-right");
      let count = oldPrev.length;
      oldPrev[count-1].className = "current-card"; 
      
       // Current card is now next
      let oldCurrent = document.getElementsByClassName("current-move-right");
      oldCurrent[0].className = "stack-next";
    }, 210);

    // Show front of card
    this.flip = false;
  }

  /**
   * Shows next card in deck
   */
  nextCard(){
    
    // If cards are moving prevent click
    if(this.checkClasses()){
      return
    }
    
    // No upcoming cards left prevents click
    if(document.getElementsByClassName("stack-next").length == 0){
      return
    }
    
    let next = document.getElementsByClassName("stack-next");
    // Next card in stack, Applies "transitional class" for movement, moves to current position
    next[0].className = "next-move-left";
    
    
    let current = document.getElementsByClassName("current-card");
    // Current flashcard, Applies "transitional class" for movement to "previous stack" position
    current[0].className = "current-move-left";
    
    // Changes classes after the CSS-transition (0.2ms) has finished
    setTimeout(function(){ 
      
      // Next card is now the current card
      let oldNext = document.getElementsByClassName("next-move-left");
      oldNext[0].className = "current-card";
      
      // Current card is now previous
      let oldCurrent = document.getElementsByClassName("current-move-left");
      oldCurrent[0].className = "stack-prev";
      
      
    }, 210);

    // Show front of card
    this.flip = false;
  }

  /**
   * Checks if a card is currently "transitioning" with css
   * Prevents multiple clicks while transitioning
   * 
   * @returns {boolean} - card is transitioning or not
   */
  private checkClasses(){
    
    // If any card is moving prevent next click
    if(document.getElementsByClassName("prev-move-right").length > 0) { return true}
    if(document.getElementsByClassName("current-move-right").length > 0) { return true}
    if(document.getElementsByClassName("next-move-left").length > 0) { return true}
    if(document.getElementsByClassName("current-move-left").length > 0) { return true}
    
    return false;
  }

  /**
   * Shows the first card in the deck
   */
  toFirstCard(){
    
    let prev = document.getElementsByClassName("stack-prev");
    let current = document.getElementsByClassName("current-card");
    current[0].className="stack-next";
    
    // Change classes for all cards
    for(let i = 0; i<prev.length; i++){

      if(i==0){
        prev[i].className = "current-card";
      }else{
        prev[i].className = "stack-next";
      }
    }


  }
}






