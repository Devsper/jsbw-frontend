import { Component, OnInit, OnDestroy } from '@angular/core';

import { UserService } from "../_services/user.service";

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.css']
})
export class UserMenuComponent implements OnInit, OnDestroy {

  isLoggedIn = localStorage.loggedIn || "";
  username = localStorage.username || "";
  userId = localStorage.userId || "";
  subscription;

  /**
   * UserMenuComponent is used 
   * as menu for logged in users
   */

   // Constructs variables from services 
  constructor(private userService: UserService) { }

  // Lifecycle hook fires after variables has been initialized/constructed
  ngOnInit() {

    this.subscription = this.userService.loginStatusChanged.subscribe(
      () => {
        this.isLoggedIn = this.userService.checkUserLoggedIn();
        this.username = this.userService.getUsername();
        this.userId = this.userService.getUserId();
      }
    );
  }

  // Lifecyckle hook removes subscription when leaving component, prevents memory leaks
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  /**
   * Logs in user from form input
   * 
   * @param {Object<NgForm>} loginForm 
   */
  onLogin(loginForm){
    
    if(loginForm.valid){

      let email = loginForm.value.email.toLowerCase();
      let pass = loginForm.value.password;

      this.userService.login(email, pass);
    }
  }

  /**
   * Register user from form input
   * 
   * @param {Object<NgForm>} registerForm 
   */
  onRegister(registerForm){
    
    if(registerForm.valid){

      let email = registerForm.value.email.toLowerCase();
      let username = registerForm.value.username; 
      let password = registerForm.value.password;
      let passwordConfirm = registerForm.value.passwordConfirm;
      
      if(password == passwordConfirm){
        this.userService.register(email, username, password, passwordConfirm);
      }
    }
  }

  onLogout(){
    this.userService.logout();
  }

}
