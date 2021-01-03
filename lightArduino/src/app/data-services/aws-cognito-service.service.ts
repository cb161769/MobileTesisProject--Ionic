
import { Injectable } from '@angular/core';
import * as AWSCognito from "amazon-cognito-identity-js";
import {environment  } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AwsCognitoServiceService {
  /**aws configuration Constants */
  private awsConfiguration = environment.COGNITO_POOL;
  /**aws user's Pool for authenticate */
  awsUserPool = new AWSCognito.CognitoUserPool(this.awsConfiguration);

  constructor() { }
  /**
   *  this method is to Register a User
   * @param email the users name Email
   * @param password the user's Password
   */
  singUp(name:any,family_name:any,email:any,phone_number:any,password:any){
    return new Promise((resolve,reject) => {
      let usersAttributes = [];
      usersAttributes.push(
        new AWSCognito.CognitoUserAttribute({Name:"name",Value:name})
      );
      usersAttributes.push(
        new AWSCognito.CognitoUserAttribute({Name:"family_name",Value:family_name})
      );
      usersAttributes.push(
        new AWSCognito.CognitoUserAttribute({Name:"email",Value:email})
      );
      usersAttributes.push(
        new AWSCognito.CognitoUserAttribute({Name:"phone_number",Value:phone_number})
      );
      this.awsUserPool.signUp(email,password,usersAttributes,null,function(err,result){
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
  /**
   * This method is fort UserName Verification 
   * @param verificationCode the User's Verification Code
   * @param userName the current User's Name
   */
  confirmUser(verificationCode:any,userName:any){
    return new Promise((resolve,reject) => {
      const cognitoUser = new AWSCognito.CognitoUser({
        Username:userName,
        Pool:this.awsUserPool
      });
      cognitoUser.confirmRegistration(verificationCode,true,function(err,result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
          
        }
      });
    });
  }
  /**
   * this method is to Authenticate Users
   * @param email 
   * @param password 
   */

  authenticate(email:any, password:any) {
    return new Promise((resolved, reject) => {
      const authDetails = new AWSCognito.AuthenticationDetails({
        Username: email,
        Password: password
      });
  
      const cognitoUser = new AWSCognito.CognitoUser({
        Username: email,
        Pool: this.awsUserPool
      });
  
      cognitoUser.authenticateUser(authDetails, {
        onSuccess: result => {
          resolved(result.getAccessToken().getJwtToken());
        },
        onFailure: err => {
          reject(err);
        },
        newPasswordRequired: userAttributes => {
          // User was signed up by an admin and must provide new
          // password and required attributes, if any, to complete
          // authentication.
  
          // the api doesn't accept this field back
          userAttributes.email = email;
          delete userAttributes.email_verified;
  
          cognitoUser.completeNewPasswordChallenge(password, userAttributes, {
            onSuccess: function(result) {},
            onFailure: function(error) {
              reject(error);
            }
          });
        }
      });
    });
  }
  getLoggedUser() {
    return new Promise((resolved, reject) => {
      var cognitoUser = this.awsUserPool.getCurrentUser();

      if (cognitoUser != null) {
        cognitoUser.getSession(function(err, result) {
          if (result) {
            resolved(result.getIdToken().getJwtToken());
          } else {
            reject(err);
          }
        });
      }
    });
  }

}

