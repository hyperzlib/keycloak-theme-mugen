export interface CaptchaService {
    verify(): Promise<any>;
}

export class CaptchaClosedError extends Error { }