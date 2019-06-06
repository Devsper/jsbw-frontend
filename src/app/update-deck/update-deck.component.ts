import { Component, OnInit, OnDestroy } from '@angular/core';
import { Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from "@angular/router";

/**
 * Workaround for bug in Angular CLI mishandling exports
 * Bug: https://github.com/angular/angular-cli/issues/9058
 * Solution: https://github.com/t4t5/sweetalert/issues/799
 */
import * as _autosize from 'autosize';
import { autosize } from 'autosize';
const autosize: autosize = _autosize as any;

import { DeckService } from "../_services/deck.service";
import { FormService } from "../_services/form.service";
import { Deck } from "../_models/Deck";

@Component({
  selector: 'app-update-deck',
  templateUrl: './update-deck.component.html',
  styleUrls: ['./update-deck.component.css']
})
export class UpdateDeckComponent implements OnInit, OnDestroy {

  /**
   *  UpdateDeckComponent handles updating of decks
   *  
   */

  // Fetches the default form from service
  deckForm: FormGroup = this.formService.form;
  title = "Uppdatera kortlek";
  isLoggedIn = localStorage.loggedIn;
  inputsToRender = 0;
  deck;
  deckSubscription;

  // Constructs variables from modules and services
  constructor(private deckService: DeckService,
              private formService: FormService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private _fb: FormBuilder) {}

  // Lifecycle hook fires after variables has been initialized/constructed           
  ngOnInit() {

    // Redirect user if not logged in
    if(!this.isLoggedIn){
      this.router.navigate(['/']);
    }

    // Only fetch deck is id is present
    this.activatedRoute.params.subscribe((params) => {

        if(params.id){
          this.loadSingleDeck(params.id);
        }
      });

      // Subscribes to a Subject, will fire when 'deckFetched' in service changes
      this.deckSubscription = this.deckService.deckFetched.subscribe(
        () => {

          // Fetches deck from service
          this.deck = this.deckService.decks;
          // How many input rows to render in form
          this.inputsToRender = this.deck.cards.length;

          // Extracts just the questions and answers
          let extractedValues = this.extractQnA(this.deck.cards);

          // Initiates a new form with right amount of rows and values
          this.deckForm = this.formService.initForm(this.inputsToRender, extractedValues, this.deck.isPublic);
        
      });
  }

  // Removes subscription when leaving component, prevents memory leaks
  ngOnDestroy(){
    this.deckSubscription.unsubscribe();
  }

  public loadSingleDeck(id){
    
    this.deckService.getDeck(id);
  }

  /**
   * Adds input row to form
   */
  addCard(){
    
    // Gets current version of form
    const control = <FormArray>this.deckForm.controls['cards'];
    // Creates another row of inputs from service and adds it to form
    control.push(this.formService.initCard());
  }

  /**
   * Removes input row from form
   * 
   * @param {number} i - Index of input row
   */
  removeCard(i) {
    // Gets current version of form
   const control = <FormArray>this.deckForm.controls['cards'];
   // Removes row of inputs from form at specified index
   control.removeAt(i);
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

/**
 * Extracts only the questions and answers from all cards
 * 
 * @param {Array.<Object>} cards - Cards to be extracted
 * @returns {Array.<Object>} - Array of objects containing question and answers
 */
extractQnA(cards){
    
    // Creates a new array of objects containing questions and answers
    let arr = cards.map(obj => {
      let a = {};
      a["question"] = obj.question;
      a["answer"] = obj.answer;

      return a;
    });

    return arr;
  }

  /**
   * Updates deck when submitted
   * 
   * @param {Object<FormGroup>} deckForm 
   */
  onUpdate(deckForm){

    if(deckForm.valid){

      // Extracts all valid cards
      let cardArray = this.deckService.getValidCards(deckForm.value.cards);

      // Creates a new deck to update from model
      let deck: Deck = {
        name: deckForm.value.deckName,
        isPublic: deckForm.value.deckPublic,
        cards: cardArray,
        createdBy: localStorage.userId,
        _id: deckForm.value.deckID
      }

      // Sends deck to service
      this.deckService.updateDeck(deck);
    }
  }

  /**
   * Deletes deck when submitted
   * 
   * @param {Object<NgForm>} deleteForm 
   */
  onDelete(deleteForm){

    if(deleteForm.valid){

      let deckID = deleteForm.value.deckID;

      // Sends deck to service
      this.deckService.deleteDeck(deckID);

    }
  }

}
