export type GeetestConfig = {
    gt: string;
    challenge: string;
    offline: boolean;
    new_captcha: boolean;
    product?: 'float' | 'popup' | 'custom' | 'bind';
    width?: string;
    lang?: string;
    https?: boolean;
    timeout?: number;
    remUnit?: number;
    zoomEle?: string|null;
    hideSuccess?: boolean;
    hideClose?: boolean;
    hideRefresh?: boolean;
};

export type GeetestCaptchaResult = {
    geetest_challenge: string;
    geetest_validate: string;
    geetest_seccode: string;
}

export type GeetestCaptchaWeb = {
    appendTo(el: string): void;
    bindForm(el: string): void;
    getValidate(): GeetestCaptchaResult|boolean;
    reset(): void;
    verify(): void;
    onReady(callback: CallableFunction): void;
    onSuccess(callback: CallableFunction): void;
    onError(callback: CallableFunction): void;
    onClose(callback: CallableFunction): void;
    destroy(): void;
};

declare function initGeetest(userConfig: GeetestConfig, callback: (captchaObj: GeetestCaptchaWeb) => any): void;