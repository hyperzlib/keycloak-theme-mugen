class SmsSenderForm {
    constructor(type, formSelector) {
        this.type = type;

        var form = this.formElem = jQuery(formSelector);
        
        this.selectAreaCode = form.find("#areaCodeInput");
        this.inputPhoneNumber = form.find("#phoneNumberInput");
        this.errorOutput = form.find("#phoneNumberInputError");
        this.inputCode = form.find("#verificationCodeInput");
        this.btnSend = form.find("#btnSendVerificationCode");

        this.countdown = null;
        this.resendTimeout = 120;

        this.errorOutput.hide();

        this.bindEvents();
        this.initConfig();
        this.initCaptcha();
    }

    bindEvents() {
        var _this = this;

        this.btnSend.on('click', this.onBtnSendClick.bind(this));

        this.inputPhoneNumber.on('input', () => {
            this.errorOutput.hide();
        });

        this.formElem.on('submit', () => {
            this.selectAreaCode.prop('disabled', false);
        });
    }

    initCaptcha() {
        this.captcha = new Captcha();
    }

    initConfig() {
        fetch(authUrl + 'realms/' + realm + '/sms').then((res) => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error(Msg.localize('cannotGetConfig'));
            }
        }).then((res) => {
            if(res.areaLocked){
                this.selectAreaCode.prop('disabled', true);
            }
            this.setAreaCodeList(res.areaCodeList || []);
            var defaultAreaCode = this.selectAreaCode.attr('data-value') || res.defaultAreaCode || 86;
            this.selectAreaCode.val(defaultAreaCode.toString());
        }).catch((err) => {
            console.error(err);
            this.showError(err.message);
        });
    }

    getFilledAreaCode(areaCode) {
        const maxLen = 4;
        let areaCodeStr = areaCode.toString();
        return '+' + areaCodeStr.toString() + ('\u2002'.repeat(maxLen - areaCodeStr.length));
    }

    getLocalizedName(nameList, langCode) {
        if(langCode in nameList){
            return nameList[langCode];
        } else {
            return nameList['en'];
        }
    }

    showError(errorMessage) {
        this.errorOutput.text(errorMessage);
        this.errorOutput.show();
    }

    setAreaCodeList(areaCodeList) {
        var html = '';
        let langCode = Msg.localize('countryNameLangCode');
        areaCodeList.map((info, index) => {
            html += '<option value="' + info.areaCode + '">' +
                this.getFilledAreaCode(info.areaCode) + '\u2002\u2002' + this.getLocalizedName(info.name, langCode) + '</option>';
        });
        this.selectAreaCode.html(html);
    }

    startCountdown() {
        let currentTimeout = this.resendTimeout;
        let resendMsg = Msg.localize('resendVerificationCode');
        let secondMsg = Msg.localize('second');
        this.countdown = setInterval(() => {
            currentTimeout -= 1;
            if (currentTimeout <= 0) {
                this.stopCountdown();
                return;
            }
            this.btnSend.text(resendMsg + ' (' + currentTimeout.toString() + secondMsg + ')');
        }, 1000);
    }

    stopCountdown() {
        if (this.countdown !== null) {
            clearInterval(this.countdown);
            this.countdown = null;
            this.btnSend.text(Msg.localize('resendVerificationCode'));
            this.btnSend.prop('disabled', false);
        }
    }

    checkInput() {
        if(this.inputPhoneNumber.val().trim() === "") {
            this.showError(Msg.localize('phoneNumberIsEmpty'));
            return false;
        }
        return true;
    }

    onBtnSendClick() {
        if (!this.checkInput()) return;
        this.captcha.verify().then((data) => {
            this.btnSend.prop('disabled', true);
            this.btnSend.text(Msg.localize('sending'));

            data.areaCode = this.selectAreaCode.find('option:selected').attr('value');
            data.phoneNumber = this.inputPhoneNumber.val();

            fetch(authUrl + 'realms/' + realm + '/sms/' + this.type + '-code', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' },
            }).then((res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error(Msg.localize('sendVerificationError', [res.status + ' ' + res.statusText]));
                }
            }).then((res) => {
                if (res.status == 1) {
                    this.startCountdown();
                } else if (res.status == 0) {
                    throw new Error(res.errormsg ? Msg.localize(res.errormsg, [res.error]) : res.error);
                }
            }).catch((err) => {
                console.error(err);
                this.showError(err.message);

                this.btnSend.prop('disabled', false);
                this.btnSend.text(Msg.localize('sendVerificationCode'));
            });
        });
    }
}