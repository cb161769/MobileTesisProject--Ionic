/**
 * 
 * @author Claudio Raul Brito Mercedes
 * @interface AuthState
 */

export interface AuthState {
    isLoggedIn: boolean;
    username: string | null;
    id: string | null;
    email: string | null;
  };