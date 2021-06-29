import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor() { }

  private userEmail:string;
  private connectionName:string;

  /**
   * this method sets the user email
   * @param userEmail user email
   */
  public setUserEmail(userEmail:any){
    this.userEmail = "";
    this.userEmail = userEmail;
  }

  /**
   * this method gets the user Email
   * @returns user's email
   */
  
  public getUserEmail():string{
    return this.userEmail;
  }
  /**
   * @author Claudio Raul Brito Mercedes
   * @param connectionName 
   */
  public setConnectionName(connectionName:string){
    this.connectionName = "";
    this.connectionName = connectionName;
  }
  public getConnectionName():string{
  return this.connectionName;
  }
}
