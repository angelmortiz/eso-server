/** List of constant responses */
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
    return responseObject(FAILED, "fail", "Document could not be deleted from the database.");
};

export const FETCHED_SUCCESSFULLY = (body: any): IResponse => {
    return responseObject(SUCCEED, "success", "Document(s) fetched successfully.", body);
}

//DELETE
export const RESPONSE_ADDED_SUCCESSFULLY = (): IResponse =>  {
    return responseObject(SUCCEED, "success", "Document added successfully to the database.");
};

export const RESPONSE_UPDATED_SUCCESSFULLY = (): IResponse =>  {
    return responseObject(SUCCEED, "success", "Document updated successfully in the database.");
};

export const RESPONSE_DELETED_SUCCESSFULLY = (): IResponse =>  {
    return responseObject(SUCCEED, "success", "Document deleted successfully from the database.");
};

export const RESPONSE_DELETE_FAILED = (): IResponse =>  {
    return responseObject(FAILED, "fail", "Document could not be deleted from the database.");
};
//

/**  */
export const responseObject = (isSuccess: boolean, status: string, message: string, body: any = null): IResponse => {
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
