export type TDBBuilderErrorCode = 'LowerDbVersion';

export class DBBuilderError extends Error {
    public readonly code: TDBBuilderErrorCode;

    constructor(code: TDBBuilderErrorCode, message: string) {
        super(message);

        // Saving class name in the property of our custom error as a shortcut.
        this.name = this.constructor.name;
        this.code = code;

        // Capturing stack trace, excluding constructor call from it.
        Error.captureStackTrace(this, this.constructor);
    }
}