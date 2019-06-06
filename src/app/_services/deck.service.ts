import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http,Headers,Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

import { Deck } from '../_models/Deck';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class DeckService {

  // Subjects creates an event that can be subscribed/listened to from components
  decksFetched = new Subject<void>();
  deckFetched = new Subject<void>();
  decks = [];

  // Constructs variables from modules
  constructor(private http: Http,
              private router: Router) { }

  // private serverAPI = 'http://localhost:5500';
  private serverAPI = 'https://flashcard-jf.herokuapp.com';

  public getAllPublicDecks(){

    let URL = this.serverAPI+"/decks/";

    // Sends GET-request to API
    return this.http.get(URL)
    .map((response: Response) => {

      // Restructure the data fetched from API
      let data = response.json();
      let decks = data.decks;

      // Sends data to .subscribe()
      return decks
    }).subscribe((data) =>{

      // Binds data from API to service variable
      this.decks = data;
      // Makes subject emmit an event for subscribers that decks have been fetched
      this.decksFetched.next();
      
    },(err) =>{
      console.log(err);
    });
  }

  /**
   * @param {number} id - User id to fetch decks for
   */
  public getAllUserDecks(id){

    let URL = this.serverAPI +"/decks/user/"+id;

    // Sends GET-request to API
    return this.http.get(URL)
      .map((response: Response) =>{

        // Restructure the data fetched from API
        let data = response.json();
        let decks = data.decks;

        // Sends data to .subscribe()
        return decks;
      }).subscribe((data) =>{
        
        // Binds data from API to service variable
        this.decks = data;
        // Makes subject emmit an event for subscribers that decks have been fetched
        this.decksFetched.next();

      },(err) =>{
        console.log(err);
      });

  }

   /**
   * @param {number} id - Deck id to fetch
   */
  public getDeck(id){

    let URL = this.serverAPI+"/decks/"+id;

    // Sends GET-request to API
    return this.http.get(URL)
      .map((response: Response) =>{
         
         // Restructure the data fetched from API
         let data = response.json()
         // Response is an array so single card is [0]
         let deck = data.decks[0];

         // Sends data to .subscribe()
         return deck;
      }).subscribe((data) =>{
        
        // Binds data from API to service variable
        this.decks = data;
        // Makes subject emmit an event for subscribers that deck have been fetched
        this.deckFetched.next();

      },(err) =>{
        console.log(err);
      });
  }

  /**
   * @param {Object<Deck>} deck - Deck to save
   */
  public saveDeck(deck){
    
    let URL = this.serverAPI+'/decks';

    // Sends POST-request with deck as payload to API
    this.http.post(URL, deck)
      .map((response: Response) => {
        
        // Sends response to .subscribe()
        return response.json();
      })
      .subscribe((data) => {

        // Redirect user if deck is successfully save
        if(data.success){
          this.router.navigate(['/overview/'+data.id]);
        }
        
      }, (err) => {
        console.log(err);
      });
  }

  /**
   * @param {Object<Deck>} deck - Deck to update
   */
  public updateDeck(deck){
    
    let URL = this.serverAPI+'/decks/'+deck._id;

    // Sends PUT-request with deck as payload to API
    this.http.put(URL, deck)
      .map((response: Response) => {
        
        // Sends response to subscribe
        return response.json();
      }).subscribe((data) => {

        // Redirects user if success
        if(data.success){
          this.router.navigate(['overview/'+data.id]);
        }
        
      }, (err) =>{
        console.log(err);
      });
  }

  /**
   * @param {number} deckID - Deck ID to delete
   */
  public deleteDeck(deckID){

    let URL = this.serverAPI+'/decks/'+deckID;

    // Sends DELETE-request to API
    this.http.delete(URL)
      .map((response: Response) => {
        // Sends response to .subscribe()
        return response.json();
      }).subscribe((data) => {

        // Redirects user if success
        if(data.success){
          this.router.navigate(['browse-decks/user/'+localStorage.userId]);
        }
        
      }, (err) =>{
        console.log(err);
      });

  }

  /**
   * Checks all input fields if they are valid to be saved to database
   * Invalid "cards" will be discarded.
   * 
   * @param {Array.<Object>} cardArray 
   * @returns {Array.<Object>} Returns all valid cards
   */
  getValidCards(cardArray){

    // Removes whitespaces for every card
    cardArray.forEach(card => {
      card.question = card.question.trim();
      card.answer = card.answer.trim();
    });

    // Creates new array with cards that has values
    let validCards = cardArray.filter(card =>  {
      
      if(card.question.length > 0 && card.answer.length > 0){
        return card;
      }
    });

    return validCards;
  }

}
