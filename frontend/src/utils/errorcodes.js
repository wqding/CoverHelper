class ErrorCode {
    constructor(code, message) {
        this.code = code;
        this.message = message;
    }
}
  
export const AUTH_USER_NOT_FOUND = new ErrorCode(
    "auth/user-not-found",
    "User not found."
    );


export const AUTH_INVALID_EMAIL = new ErrorCode(
    "auth/invalid-email",
    "Invalid email address."
    );

export const AUTH_WRONG_PASSWORD = new ErrorCode(
    "auth/wrong-password",
    "Invalid password."
    );

export const AUTH_MISSING_PASSWORD = new ErrorCode(
    "auth/missing-password",
    "Password is missing."
    );

export const AUTH_EMAIL_ALREADY_IN_USE = new ErrorCode(
    "auth/email-already-in-use",
    "Email is already in use."
    );

export const AUTH_TOO_MANY_REQUESTS = new ErrorCode(
    "auth/too-many-requests",
    "Too many failed login attempts. Try again later."
)