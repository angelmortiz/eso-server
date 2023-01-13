/** List of reusable responses for apis*/
export const ADDED_SUCCESSFULLY = (): IResponse =>  {
    return responseObject(SUCCEED, "success", "Document added successfully to the database.");
};

export const UPDATED_SUCCESSFULLY = (): IResponse =>  {
    return responseObject(SUCCEED, "success", "Document updated successfully in the database.");
};

export const DELETED_SUCCESSFULLY = (): IResponse =>  {
    return responseObject(SUCCEED, "success", "Document deleted successfully from the database.");
};

export const DELETE_FAILED = (): IResponse =>  {
    return responseObject(FAILED, "failed", "Document could not be deleted from the database.");
};

export const FETCHED_SUCCESSFULLY = (body: any): IResponse => {
    return responseObject(SUCCEED, "success", "Document(s) fetched successfully.", body);
}

export const LOGGED_OUT_SUCCESSFULLY = (): IResponse =>  {
    return responseObject(SUCCEED, "success", "User logged out successfully");
};

export const TOKEN_SENT_SUCCESSFULLY = (): IResponse =>  {
    return responseObject(SUCCEED, "success", "Reset token sent to email successfully.");
};

export const USER_AUTHENTICATION_RESPONSE = (isUserAuthenticated: boolean, message: string): IResponse =>  {
    //**Note: this function is used to notify the client-side whether the user authentication is valid or not. 
    //It always responds with a isSuccess=true because we only care about the isUserAuthenticated value.
    //Whether isUserAuthenticated is true or false, the response should be isSuccess=true either way.
    return responseObject(SUCCEED, isUserAuthenticated ? "success" : "failed", message, { isUserAuthenticated });
};

/**  */
export const responseObject = (isSuccess: boolean, status: StatusType, message: string, body: any = null): IResponse => {
    return { isSuccess, status, message, body };
}

const SUCCEED = true;
const FAILED = false;

export enum RESPONSE_CODE {
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    NOT_FOUND = 404,
    NOT_ACCEPTED = 406,
}

export interface IResponse {
    isSuccess: boolean,
    status: string,
    message: string,
    body: any | null
}

type StatusType = 'success' | 'failed' | 'error';
