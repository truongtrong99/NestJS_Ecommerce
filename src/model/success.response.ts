
interface ISuccessResponse<T> {
    message: string;
    statusCode: number;
    reasonStatus: string;
    metadata: T;
}
interface ICreatedSuccessResponse<T> extends Omit<ISuccessResponse<T>, 'statusCode' | 'reasonStatus'> {
    options?: any;
}
interface IOkSuccessResponse<T> extends Omit<ISuccessResponse<T>, 'statusCode' | 'reasonStatus'> { }

const STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204
}

const REASON_STATUSES = {
    SUCCESS: 'Success',
    CREATED: 'Created',
    ACCEPTED: 'Accepted',
    NO_CONTENT: 'No Content'
}


class SuccessResponse<T> {
    message: string;
    statusCode: number;
    reasonStatus: string;
    metadata: T;

    constructor({
        message,
        statusCode = STATUS_CODES.OK,
        reasonStatus = REASON_STATUSES.SUCCESS,
        metadata
    }: ISuccessResponse<T>) {
        this.message = message ? message : reasonStatus;
        this.statusCode = statusCode;
        this.reasonStatus = reasonStatus;
        this.metadata = metadata;
    }
}

class OK<T> extends SuccessResponse<T> {
    constructor({ message, metadata }: IOkSuccessResponse<T>) {
        super({
            message,
            statusCode: STATUS_CODES.OK,
            reasonStatus: REASON_STATUSES.SUCCESS,
            metadata
        });
    }
}

class CREATED<T> extends SuccessResponse<T> {
    options: any;
    constructor({ message, metadata, options }: ICreatedSuccessResponse<T>) {
        super({
            message,
            statusCode: STATUS_CODES.CREATED,
            reasonStatus: REASON_STATUSES.CREATED,
            metadata
        });
        this.options = options;
    }
}

export { OK, CREATED };