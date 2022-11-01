export interface IResponse {
    code: number,
    isSuccess: boolean,
    message: string,
    body: any | null
}

export const RESPONSE_ADDED_SUCCESSFULLY = (): IResponse =>  {
    return RESPONSE(CREATED_CODE, SUCCEED, "Document added successfully to the database.");
};

export const RESPONSE_DELETED_SUCCESSFULLY = (): IResponse =>  {
    return RESPONSE(OK_CODE, SUCCEED, "Document deleted successfully from the database.");
};

export const RESPONSE_DELETE_FAILED = (): IResponse =>  {
    return RESPONSE(NOT_ACCEPTED, FAILED, "Document could not be deleted from the database.");
};

//CONSTANT STATUS AND CODES
const RESPONSE = (code: number, isSuccess: boolean = true, message: string, body: any = null): IResponse => {
    return {
        code: code,
        isSuccess: isSuccess,
        message: message,
        body: body
    }
}
const OK_CODE = 200;
const CREATED_CODE = 201;
const ACCEPTED_CODE = 202;
const NOT_FOUND = 404;
const NOT_ACCEPTED = 406;
const SUCCEED = true;
const FAILED = false;