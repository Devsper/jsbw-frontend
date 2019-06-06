import { Component, OnInit } from '@angular/core';
import { UserService } from "../_services/user.service";

import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-startpage',
  templateUrl: './startpage.component.html',
  styleUrls: ['./startpage.component.css']
})
export class StartpageComponent implements OnInit {

  /**
   *  StartpageComponent is used for as startpage for
   *  both logged in and logged out users
   */

  // Variable to handle 'flip functionality' of cards
  flip = false;
  userId = localStorage.userId || "";

   // Constructs variables from modules and services
  constructor(private userService: UserService,
              public modalService: NgxSmartModalService) { }

  ngOnInit() {
  }

  /**
   * Checks with service if user is logged in or not
   * 
   * @returns {boolean} - Login status true/false
   */
  isLoggedIn(){

    if(this.userService.checkUserLoggedIn()){
      return true;
    }else{
      return false;
    }
  }

  toggleClass(){
    // Toggles variable true/false
    this.flip = !this.flip;
  }

}
