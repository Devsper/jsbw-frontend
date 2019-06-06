import { OnInit, OnDestroy, Component } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';

import { UserService } from "../_services/user.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  
  /**
   *  HeaderComponent is used for showing
   *  the page footer for every page
   */

  isLoggedIn = localStorage.loggedIn || "";
  userId;
  subscription;

   // Constructs variables from  services
  constructor(private userService: UserService) {
  }

  // Lifecycle hook fires after variables has been initialized/constructed
  ngOnInit() {

    // Fetches user id from service
    this.userId =  this.userService.userId;

    // Subscribes to a Subject, will fire when 'loginStatusChanged' in service changes
    this.subscription = this.userService.loginStatusChanged.subscribe(
      () => {
        this.isLoggedIn = this.userService.checkUserLoggedIn();
        this.userId = this.userService.getUserId();
      }
    );

  }

  // Removes subscription when leaving component, prevents memory leaks
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
