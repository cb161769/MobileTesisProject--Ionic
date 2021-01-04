import { Injectable } from '@angular/core';
import {Auth} from 'aws-amplify';
import {environment} from '../../environments/environment';
import {Amplify} from 'aws-amplify'

@Injectable({
  providedIn: 'root'
})
export class AwsAmplifyService {
  /**
   * this is the Aws Amplify Service Constructor
   */
  error:any;

  constructor() {
    Amplify.configure({
      Auth:
      {
        mandatorySignId:true,
        region:environment.Region,
        userPoolId:environment.COGNITO_POOL.UserPoolId,
        userPoolWebClientId:environment.COGNITO_POOL.ClientId
      }
    });

  }
  /**
   * this method is to SingUp or 
   * @param username 
   * @param password 
   */
   async singUp(username:any,password:any,email?:any,name?:any,familyName?:any,phone?:any){
     try {
       const singUpResponse = await Auth.signUp({
         username,
         password,
         attributes:{
           email:email,
           name:name,
           family_name:familyName,
           phone_number:phone
         }
       });
       return singUpResponse;
       
     } catch (error) {
       this.returnErrors(error);
       // console.log(error);

     }
   }
   /**
    * this method is to return an Error
    * @param error the Error
    */
   returnErrors(error:any){
     this.error = null;
     this.error = error;
    
   }
   getErrors(){
     return this.error;

   }
    confirmSingUp(username:any,confirmationCode:any) {
    try {
      const userConfirmed = Auth.confirmSignUp(username,confirmationCode);
      return userConfirmed;
      
    } catch (error) {
      this.returnErrors(error);
      console.log(error);
    } 
   }
   async singIn(userName:any,password:any){
     try {
       const userSingedIn = await Auth.signIn(userName,password);
       return userSingedIn;
       
     } catch (error) {
      this.returnErrors(error.message);
      // console.log(error);
       
     }

   }

}
