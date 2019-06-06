import { Injectable } from '@angular/core';
import { Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';

@Injectable()
export class FormService {

  form: FormGroup = this.initForm(1);
  
  // Constructs variables from modules
  constructor(private _fb: FormBuilder) { }

  /**
   * Dynamically render inputs for form 
   * For both new decks and existing decks
   * 
   * @param {number} inputsToRender - Rows of inputs to render
   * @param {Array.<Object>} [valueData=[]] - Values to display in inputs if present
   * @param {boolean} [isPublic=false] - Is deck public or not
   * @returns {Object<FormGroup>} Returns a form to render as HTML
   */
  initForm(inputsToRender, valueData = [], isPublic = false){

    let arr = [];

    // If inputs should have existing values
    if(valueData.length > 0){
      
      for(let i = 0; i<inputsToRender; i++){

        // Create a "card" input with values
        arr.push(this.initCard(valueData[i].question, valueData[i].answer));
      }
    }else{
      
      // Create a "card" input without values
      for(let i = 0; i<inputsToRender; i++){
        arr.push(this.initCard());
      }
    }

    // Creates form structure with values
    return this._fb.group({
      deckName: ["", Validators.required],
      deckPublic: isPublic,
      cards: this._fb.array(arr),
      deckID: ""
    });
  }

  /**
   * Creates "card" inputs for form
   * 
   * @param {string} [q=''] - Question string to render
   * @param {string} [a=''] - Answer string to render
   * @returns {Object}
   */
  initCard(q = '', a = '') {
    // initialize card
    return this._fb.group({
        question: [q],
        answer: [a]
    }
    );
  }
}
