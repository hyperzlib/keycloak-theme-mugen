import { CaptchaClosedError, CaptchaService } from "./CaptchaService";
import { Msg } from '../widgets/Msg';
import { KeycloakService } from '../keycloak-service/keycloak.service';
import { GeetestCaptchaResult, GeetestCaptchaWeb, initGeetest } from "./gt";

export class GeetestCaptcha implements CaptchaService {
    private kcSrv: KeycloakService
    private captchaObj: GeetestCaptchaWeb;
    private shouldCallCaptcha: boolean = false;
    private onSuccess: CallableFunction|null;
    private onError: CallableFunction|null;

    public constructor(keycloakService: KeycloakService) {
        this.kcSrv = keycloakService;
        fetch(this.kcSrv.authServerUrl() + 'realms/' + this.kcSrv.realm() + '/geetest/code').then((res) => {
            if (res.ok) {
                return res.json();
            } else {
                throw Msg.localize('captchaCodeApiRequestError');
            }
        }).then((data) => {
            initGeetest({
                gt: data.gt,
                challenge: data.challenge,
                offline: !data.success,
                new_captcha: true,
                product: 'bind',
            }, (obj: GeetestCaptchaWeb) => {
                this.captchaObj = obj;
                if (this.shouldCallCaptcha) { //加载完成后立刻调用
                    this.captchaObj.verify();
                    this.captchaObj.onSuccess(this.buildOnSuccess(this.onSuccess ? this.onSuccess : () => {}));
                    this.shouldCallCaptcha = false;
                    this.onSuccess = null;
                    this.onError = null;
                }
            })
        });
    }

    public verify(): Promise<GeetestCaptchaResult|boolean> {
        return new Promise((resolve, reject) => {
            if (!this.captchaObj) {
                this.shouldCallCaptcha = true;
                this.onSuccess = resolve;
                this.onError = reject;
            } else { //已经加载成功的情况，直接调用
                this.captchaObj.verify();
                this.captchaObj.onSuccess(this.buildOnSuccess(resolve));
                this.captchaObj.onError((err: Error) => {
                    alert(Msg.localize('captchaLoadError'));
                    reject(err);
                });

                this.captchaObj.onClose(() => {
                    reject(new CaptchaClosedError());
                });
            }
        });
    }

    private buildOnSuccess(resolve: CallableFunction): CallableFunction {
        return () => {
            var result = this.captchaObj.getValidate();
            resolve(result);
            this.captchaObj.reset();
        };
    }
}