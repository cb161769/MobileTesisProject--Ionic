import { Injectable } from '@angular/core';
import {Auth} from 'aws-amplify';
import {environment} from '../../environments/environment';
import {Amplify} from 'aws-amplify';
import { error } from 'protractor';

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
   * This method's is for the User SingIn
   * @param username 
   * @param password 
   * @param email 
   * @param name 
   * @param familyName 
   * @param phone 
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
       this.returnErrors(error.message);
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
   /**  
    * this method get's the current Error
    */
   getErrors(){
     return this.error;

   }
   /**
    * this method confirms the User's Sing up
    * @param username userName
    * @param confirmationCode user's confirmation code
    */
    confirmSingUp(username:any,confirmationCode:any) {
    try {
      const userConfirmed = Auth.confirmSignUp(username,confirmationCode);
      return userConfirmed;
      
    } catch (error) {
      this.returnErrors(error.message);
      console.log(error);
    } 
   }
   /**
    * This method's is to Sing in to the System
    * @param userName the UserName
    * @param password the Password
    */
   async singIn(userName:any,password:any){
     try {
       const userSingedIn = await Auth.signIn(userName,password);
       return userSingedIn;
       
     } catch (error) {
      this.returnErrors(error.message);
      // console.log(error);
       
     }

   }
   /**
    * this method get's the current Logged User
    */
   async getCurrentUser(){
     try {
       const currentUser = await Auth.currentAuthenticatedUser();
       return currentUser;
     } catch (error) {
       this.returnErrors(error.message);
     }
   }
   /**
    * this method is to the User Sing out
    */
   async singOut(){
     try {
       await Auth.signOut();
     } catch (error) {
       this.returnErrors(error.message);
     }
   }
   /**
    * this method is for the user's Forgot Password
    * @param userName user's Name name
    */
   async forgotPassword(userName:any){
     await Auth.forgotPassword(userName).then((data) => {
       const userData = data;
       return userData;
     }).catch((err) => {
       this.returnErrors(err.message);
     });
   }
   /**
    * this method is for the Forgot Password Submit
    * @param userName userName
    * @param code userName code
    * @param new_password new Password
    */
   async forgotPasswordSubmit(userName:any,code:any,new_password:any){
     await Auth.forgotPasswordSubmit(userName,code,new_password).then((data) => {
       const userData = data;
       return userData;
     }).catch((error) => {
       this.returnErrors(error.message);
     });
   }
    async retrieveCurrentSesion():Promise<any>
   {
     const userToken = (await Auth.currentSession()).getAccessToken().getJwtToken();
     console.log(userToken);
     return userToken;

   }




}
