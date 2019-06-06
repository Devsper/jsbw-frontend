import { Component, OnInit, OnDestroy } from '@angular/core';
import { Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';


/**
 * Workaround for bug in Angular CLI mishandling exports
 * Bug: https://github.com/angular/angular-cli/issues/9058
 * Solution: https://github.com/t4t5/sweetalert/issues/799
 */
import * as _autosize from 'autosize';
import { autosize } from 'autosize';
const autosize: autosize = _autosize as any;

import { UserService } from "../_services/user.service";
import { DeckService } from "../_services/deck.service";
import { FormService } from "../_services/form.service";
import { Deck } from "../_models/Deck";
 
@Component({
  selector: 'app-create-deck',
  templateUrl: './create-deck.component.html',
  styleUrls: ['./create-deck.component.css']
})

export class CreateDeckComponent implements OnInit, OnDestroy {

  /**
   * CreateDeckComponent is used 
   * for creating a new deck 
   */

  // Initializes variables
  deckForm: FormGroup;  // Will hold form
  title = "Skapa ny kortlek";
  isLoggedIn = localStorage.loggedIn;
  inputsTorender = 3;
  subscription;

   // Constructs variables from modules and services
  constructor(private userService: UserService,
              private deckService: DeckService,
              private formService: FormService,
              private _fb: FormBuilder) { }

   // Lifecycle hook fires after variables has been initialized/constructed
  ngOnInit() {
    
    // Subscribes to 'Subject', will fire when 'loginStatusChanged' in service changes
    this.subscription = this.userService.loginStatusChanged.subscribe(
      () => {
        // Adds variable to component when status changes
        this.isLoggedIn = this.userService.checkUserLoggedIn();
      }
    );

    // Initializes form with specified amount of input rows
    this.deckForm = this.formService.initForm(this.inputsTorender);
  }

  // Removes subscription when leaving component, prevents memory leaks
  ngOnDestroy(){
      this.subscription.unsubscribe();
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
   * Saves deck when submitted
   * 
   * @param {Object<FormGroup>} deckForm 
   */
  onSave(deckForm){

    if(deckForm.valid){

      // Extracts all valid cards
      let cardArray = this.deckService.getValidCards(deckForm.value.cards);

      // Creates a new deck to save from model
      let deck: Deck = {
        name: deckForm.value.deckName,
        isPublic: deckForm.value.deckPublic,
        cards: cardArray,
        createdBy: localStorage.userId
      }

      // Sends deck to service
      this.deckService.saveDeck(deck);
    }
  }
}

