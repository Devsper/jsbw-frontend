import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response } from "@angular/http";
import { Subject } from "rxjs/Subject";
import "rxjs/add/operator/map";

@Injectable()
export class UserService {

  // Fetches values from localStorage or leave empty
  user = localStorage.loggedIn     || "";
  username = localStorage.username || "";
  userId = localStorage.userId     || "";
  // Subjects creates an event that can be subscribed/listened to from components
  loginStatusChanged = new Subject<void>();


  // Constructs variables from modules
  constructor(private http: Http,
              private router: Router) {}

  /**
   * Logs in user to application
   * 
   * @param {string} email - Entered email
   * @param {string} password - Entered password
   */
  login(email, password) {

    //let URL = 'http://localhost:5500/login'
    let URL = 'https://flashcard-jf.herokuapp.com/login';


    // Sends POST-request to API with login credentials
    this.http.post(URL, { logEmail: email, logPassword: password })
      .map((response: Response) => {
        
        // Sends response to .subscribe()
        return response.json();
      })
      .subscribe((data) => {

        if (data.success === true) {

          // Add values to localStorage
          this.user = localStorage.loggedIn = true;
          this.username = localStorage.username = data.username;
          this.userId = localStorage.userId = data.userId;

          // Makes subject emmit an event for subscribers that login status has changed 
          this.loginStatusChanged.next();

          // Simulates click outside of modal window to close it
          let overlay: HTMLElement = document.getElementsByClassName('overlay')[0] as HTMLElement;
          overlay.click();
        }

      }, (err) => {
        console.log(err);
      });
  }

  /**
   * Logs out user from application
   * 
   */
  logout() {

      //let URL = 'http://localhost:5500/logout';
      let URL = 'https://flashcard-jf.herokuapp.com/logout';

      // Sends GET-request to API to activate logout
      this.http.get(URL)
        .map((response: Response) => {

           // Sends response to .subscribe()
          return response.json();
        })
        .subscribe((data) => {

          // Removes user from service and localStorage
          this.user = "";
          this.username = "";
          this.userId = "";
          localStorage.removeItem("loggedIn");
          localStorage.removeItem("username");
          localStorage.removeItem("userId");
          
          // Makes subject emmit an event for subscribers that login status has changed 
          this.loginStatusChanged.next();

          // Redirect user to startpage
          this.router.navigate(['/']);
        }
        );
    }
  
  /**
   * Register user to application
   * 
   * @param {string} email - Entered email
   * @param {string} username - Entered username
   * @param {string} password - Entered password
   * @param {string} passwordConfirm - Same as password 
   */
  register(email, username, password, passwordConfirm) {

    //let URL = 'http://localhost:5500/register';
    let URL = 'https://flashcard-jf.herokuapp.com/register';

    // Data to send from inputs, passwordConfirm will be stored as 
    // Plain text, just for development purposes
    let user = { email: email, 
                 username: username, 
                 password: password, 
                 passwordConf: passwordConfirm 
               }

    // Sends POST-request to API        
    this.http.post(URL, user)
      .map((response: Response) => {
        // Sends response to .subscribe()
        return response.json();
      })
      .subscribe((data) => {

        // When registered log in user
        this.login(email, password);

        // Simulates click outside of modal window to close it
        let overlay: HTMLElement = document.getElementsByClassName('overlay')[0] as HTMLElement;
        overlay.click();

      }, (err) => {
        console.log(err);
      }
      );
  }

  checkUserLoggedIn() {
    return this.user;
  }

  getUsername(){
    return this.username;
  }

  getUserId(){
    return this.userId;
  }
}
