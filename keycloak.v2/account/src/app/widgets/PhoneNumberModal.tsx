import * as React from 'react';
import {
    Button,
    ButtonProps,
    Form,
    FormGroup,
    FormSelect,
    FormSelectOption,
    InputGroup,
    TextInput,
    ValidatedOptions,
} from '@patternfly/react-core';
import {Modal, ModalVariant} from './Modal';
import {Msg} from './Msg';
import {CaptchaService} from '../util/CaptchaService';
import {GeetestCaptcha} from '../util/GeetestCaptcha';
import {KeycloakContext} from '../keycloak-service/KeycloakContext';
import {KeycloakService} from '../keycloak-service/keycloak.service';

interface PhoneNumberModelProps {
    type: string;
    buttonTitle?: string;
    buttonId?: string;
    buttonVariant?: ButtonProps['variant'];
    oldPhoneNumber?: string;

    render?(toggle: () => void): React.ReactNode;

    onChange?: (phoneNumber: string | undefined) => void;
    onClose?: () => void;
    isDisabled?: boolean;
}

interface PhoneNumberModelState {
    isOpen: boolean;
    inputAreaCode: string;
    inputPhoneNumber: string;
    inputSmsCode: string;
    sendSmsCodeBtnLabel: string;
    sendSmsCodeBtnEnabled: boolean;
    saveBtnLabel: string;
    saveBtnEnabled: boolean;

    areaLocked: boolean;
    areaCodeList: AreaCodeInfo[];

    errors: {
        phoneNumber: string;
        smsCode: string;
    };
}

interface AreaCodeInfo {
    areaCode: number;
    countryCode: string;
    name: { [lang: string]: string };
}

/**
 * show a modal to change phone number
 *
 * @author Hyperzlib hyperzlib@outlook.com
 */
export class PhoneNumberModal extends React.Component<PhoneNumberModelProps, PhoneNumberModelState> {
    private verifiedPhoneNumber: string | undefined;
    private countdownIntervalId: NodeJS.Timeout;
    private keycloak: KeycloakService | undefined;
    private captchaService: CaptchaService;
    private defaultAreaCode: string;
    private areaLocked: boolean = false;
    private allowUnset: boolean = true;

    protected static defaultProps = {
        buttonVariant: 'primary',
        modalContinueButtonLabel: 'continue',
        modalCancelButtonLabel: 'doCancel',
        isDisabled: false,
        isSmall: true
    };

    public constructor(props: PhoneNumberModelProps) {
        super(props);

        this.state = {
            isOpen: false,
            inputAreaCode: '',
            inputPhoneNumber: '',
            inputSmsCode: '',
            sendSmsCodeBtnLabel: Msg.localize('sendSmsCodeBtn'),
            sendSmsCodeBtnEnabled: true,
            saveBtnLabel: Msg.localize('doSave'),
            saveBtnEnabled: true,
            areaLocked: false,
            areaCodeList: [],
            //areaCodeOptions: [],
            errors: {
                phoneNumber: '',
                smsCode: '',
            }
        };
    }

    public componentDidUpdate(prevProps: PhoneNumberModelProps) {
        if (prevProps.oldPhoneNumber != this.props.oldPhoneNumber) {
            this.setFullPhoneNumber(this.props.oldPhoneNumber);
        }
    }

    private setFullPhoneNumber = (fullPhoneNumber: string | undefined) => {
        let areaCode: string = this.defaultAreaCode;
        let phoneNumber: string = '';

        if (fullPhoneNumber) {
            let chunks = fullPhoneNumber.split(' ');
            if (chunks.length === 2) {
                areaCode = chunks[0].replace(/^\+/g, '');
                phoneNumber = chunks[1];
            } else {
                phoneNumber = fullPhoneNumber;
            }
        }

        this.setState({
            inputAreaCode: areaCode,
            inputPhoneNumber: phoneNumber,
        });
    };

    private setAreaCodeList = (areaCodeList: AreaCodeInfo[]) => {
        this.setState({areaCodeList});
    }

    private initKeycloakService = (keycloak: KeycloakService | undefined) => {
        if (typeof this.keycloak === 'undefined') {
            this.keycloak = keycloak;
            this.initConfig();
            this.initCaptcha();
        }
    };

    private initConfig = () => {
        fetch(this.keycloak?.authServerUrl() + 'realms/' + this.keycloak?.realm() + '/sms').then((res) => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error(Msg.localize('cannotGetConfig'));
            }
        }).then((res) => {
            this.allowUnset = res.allowUnset ?? true;
            this.setState({
                areaLocked: res.areaLocked ?? false,
            });
            this.setAreaCodeList(res.areaCodeList ?? []);
            this.defaultAreaCode = res.defaultAreaCode.toString();
            if (!this.props.oldPhoneNumber || res.areaLocked) {
                this.setState({
                    inputAreaCode: this.defaultAreaCode ?? '86',
                });
            }
        }).catch((err) => {
            this.setState({
                errors: {...this.state.errors, phoneNumber: err.message},
            });
        });
    };

    private initCaptcha = () => {
        if (this.keycloak && !this.captchaService) {
            this.captchaService = new GeetestCaptcha(this.keycloak);
        }
    };

    private getFilledAreaCode = (areaCode: number): string => {
        const maxLen = 4;
        let areaCodeStr = areaCode.toString();
        return '+' + areaCodeStr.toString() + ('\u2002'.repeat(maxLen - areaCodeStr.length));
    }

    private getLocalizedName = (nameList: { [lang: string]: string }) => {
        let langCode = Msg.localize('countryNameLangCode');
        if (langCode in nameList) {
            return nameList[langCode];
        } else {
            return nameList['en'];
        }
    };

    private validatePhoneNumber = (): boolean => {
        if (this.state.inputPhoneNumber.trim().length === 0) {
            this.setState({
                errors: {...this.state.errors, phoneNumber: Msg.localize('phoneNumberCannotBeEmpty')},
            });
            return false;
        }
        return true;
    };

    private validateSmsCode = () => {
        if (this.state.inputPhoneNumber.trim().length === 0) {
            this.setState({
                errors: {...this.state.errors, phoneNumber: Msg.localize('smsCodeCannotBeEmpty')},
            });
            return false;
        }
        return true;
    };

    private startCountdown = (expire: number) => {
        let countdownNum = expire;
        this.setState({ sendSmsCodeBtnEnabled: false });
        this.countdownIntervalId = setInterval(() => {
            countdownNum -= 1;
            if (countdownNum <= 0) {
                this.stopCountdown();
                return;
            }
            this.setState({
                sendSmsCodeBtnLabel: Msg.localize('resendSmsCodeAfter', [countdownNum.toString()]),
            });
        }, 1000);
    };

    private stopCountdown = () => {
        clearInterval(this.countdownIntervalId);
        this.setState({
            sendSmsCodeBtnEnabled: true,
            sendSmsCodeBtnLabel: Msg.localize('sendSmsCodeBtn')
        });
    };

    private handleAreaCodeChange = (value: string) => {
        if (!this.state.areaLocked) {
            this.setState({
                inputAreaCode: value,
            });
        }
    };

    private handleChange = (value: string, event: React.FormEvent<HTMLInputElement>) => {
        const target = event.currentTarget;
        const name = target.name;

        this.setState({
            errors: {...this.state.errors, [name]: target.validationMessage},
        });

        switch (name) {
            case 'phoneNumber':
                this.setState({inputPhoneNumber: value});
                break;
            case 'smsCode':
                this.setState({inputSmsCode: value});
                break;
        }
    };

    private handleSendSmsCode = () => {
        if (!this.state.sendSmsCodeBtnEnabled) return;
        if (!this.validatePhoneNumber()) return;
        this.captchaService.verify().then((data: any) => {
            //开始发送短信验证码的流程
            this.setState({
                sendSmsCodeBtnEnabled: false,
                sendSmsCodeBtnLabel: Msg.localize('sendingSmsCode'),
            });

            data.areaCode = this.state.inputAreaCode;
            data.phoneNumber = this.state.inputPhoneNumber;

            fetch(this.keycloak?.authServerUrl() + 'realms/' + this.keycloak?.realm() + '/sms/verification-code', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {'Content-Type': 'application/json'},
            }).then((res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error(Msg.localize('sendSmsCodeError', [`${res.status} ${res.statusText}`]));
                }
            }).then((res) => {
                if (res.status == 1) {
                    this.startCountdown(120);
                } else {
                    let errorMsg = res.errormsg ? Msg.localize(res.errormsg, [res.error]) : res.error;
                    throw new Error(errorMsg);
                }
            }).catch((err) => {
                this.setState({
                    errors: {...this.state.errors, smsCode: err.message},
                    sendSmsCodeBtnEnabled: true,
                    sendSmsCodeBtnLabel: Msg.localize('sendSmsCodeBtn'),
                });
            });
        });
    };

    private handleModalToggle = (isOpen = !this.state.isOpen) => {
        this.setState({
            isOpen: isOpen
        });
        if (!this.state.isOpen && this.props.onClose) this.props.onClose();
    };

    private handleSavePhoneNumber = () => {
        if (this.allowUnset && this.state.inputPhoneNumber.trim() === "") {
            // 删除手机号
            this.setState({
                saveBtnEnabled: false,
                saveBtnLabel: Msg.localize('saving'),
            });
            fetch(this.keycloak?.authServerUrl() + 'realms/' + this.keycloak?.realm() + '/sms/update-profile/unset', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
            }).then((res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error(Msg.localize('savePhoneNumberError'));
                }
            }).then((res) => {
                if (res.status == 1) {
                    this.setState({
                        saveBtnEnabled: true,
                        saveBtnLabel: Msg.localize('doSave'),
                    });
                    this.handleModalToggle(false);
                    delete this.verifiedPhoneNumber;

                    if (this.props.onChange) {
                        this.props.onChange(this.verifiedPhoneNumber);
                    }
                } else {
                    let errorMsg = res.errormsg ? Msg.localize(res.errormsg, [res.error]) : res.error;
                    throw new Error(errorMsg);
                }
            }).catch((err) => {
                this.setState({
                    errors: {...this.state.errors, phoneNumber: err.message},
                    saveBtnEnabled: true,
                    saveBtnLabel: Msg.localize('doSave'),
                });
            });
        } else {
            let validated = this.validatePhoneNumber();
            validated = this.validateSmsCode() && validated;
            if (validated) {
                // 开始提交手机号
                this.setState({
                    saveBtnEnabled: false,
                    saveBtnLabel: Msg.localize('saving'),
                });

                let data: any = {
                    areaCode: this.state.inputAreaCode,
                    phoneNumber: this.state.inputPhoneNumber,
                    smsCode: this.state.inputSmsCode,
                };
                fetch(this.keycloak?.authServerUrl() + 'realms/' + this.keycloak?.realm() + '/sms/update-profile', {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {'Content-Type': 'application/json'},
                }).then((res) => {
                    if (res.ok) {
                        return res.json();
                    } else {
                        throw new Error(Msg.localize('savePhoneNumberError'));
                    }
                }).then((res) => {
                    if (res.status == 1) {
                        this.setState({
                            saveBtnEnabled: true,
                            saveBtnLabel: Msg.localize('doSave'),
                        });
                        this.handleModalToggle(false)
                        this.verifiedPhoneNumber = '+' + this.state.inputAreaCode.toString() + ' ' + this.state.inputPhoneNumber;

                        if (this.props.onChange) {
                            this.props.onChange(this.verifiedPhoneNumber);
                        }
                    } else {
                        let errorMsg = res.errormsg ? Msg.localize(res.errormsg, [res.error]) : res.error;
                        throw new Error(errorMsg);
                    }
                }).catch((err) => {
                    this.setState({
                        errors: {...this.state.errors, smsCode: err.message},
                        saveBtnEnabled: true,
                        saveBtnLabel: Msg.localize('doSave'),
                    });
                });
            }
        }
    };

    public render(): React.ReactNode {
        const {isOpen: isModalOpen} = this.state;

        return (
            <React.Fragment>
                <KeycloakContext.Consumer>
                    {
                        keycloak => {
                            this.initKeycloakService(keycloak);
                            return (
                                <Button
                                    id={this.props.buttonId}
                                    variant={this.props.buttonVariant}
                                    onClick={() => this.handleModalToggle(true)}
                                    isDisabled={this.props.isDisabled}
                                >
                                    {this.props.buttonTitle}
                                </Button>
                            )
                        }
                    }
                </KeycloakContext.Consumer>
                {this.props.render && this.props.render(() => this.handleModalToggle(true))}
                <Modal
                    className={"phoneNumberModal"}
                    title={Msg.localize('changePhoneNumber')}
                    variant={ModalVariant.small}
                    isOpen={isModalOpen}
                    disabled={this.props.isDisabled}
                    onClose={() => this.handleModalToggle(false)}
                    actions={[
                        <Button id='modal-confirm' key="confirm" variant="primary" onClick={this.handleSavePhoneNumber}>
                            {this.state.saveBtnLabel}
                        </Button>
                    ]}
                >
                    <Form isHorizontal>
                        <FormGroup
                            label={Msg.localize('phoneNumber')}
                            fieldId="phone-number"
                            helperTextInvalid={this.state.errors.phoneNumber}
                            validated={
                                this.state.errors.phoneNumber !== ""
                                ? ValidatedOptions.error
                                : ValidatedOptions.default
                            }
                        >
                            <InputGroup>
                                {/*
                                <Select
                                    id="area-code"
                                    className="select-area-code"
                                    style={{ width: "6em" }}
                                    options={this.state.areaCodeOptions}
                                    isClearable={false}
                                    isMulti={false}
                                    isDisabled={this.state.areaLocked}
                                />
                                */}
                                <FormSelect
                                    id="area-code"
                                    className="select-area-code"
                                    value={this.state.inputAreaCode}
                                    onChange={this.handleAreaCodeChange}
                                    readOnly={this.state.areaLocked}
                                    style={{width: "5.2em", textOverflow: "clip"}}
                                >
                                    {this.state.areaCodeList.map((info, index) => (
                                        <FormSelectOption
                                            key={index}
                                            value={info.areaCode}
                                            label={this.getFilledAreaCode(info.areaCode) + '\u2002\u2002' + this.getLocalizedName(info.name)}
                                        >
                                        </FormSelectOption>
                                    ))}
                                </FormSelect>
                                <TextInput
                                    type="tel"
                                    id="phone-number"
                                    name="phoneNumber"
                                    maxLength={11}
                                    value={this.state.inputPhoneNumber}
                                    onChange={this.handleChange}
                                    validated={
                                        this.state.errors.phoneNumber !== ""
                                        ? ValidatedOptions.error
                                        : ValidatedOptions.default
                                    }
                                >
                                </TextInput>
                            </InputGroup>
                        </FormGroup>
                        <FormGroup
                            label={Msg.localize('smsCode')}
                            fieldId="sms-code"
                            helperTextInvalid={this.state.errors.smsCode}
                            validated={
                                this.state.errors.smsCode !== ""
                                ? ValidatedOptions.error
                                : ValidatedOptions.default
                            }
                        >
                            <InputGroup>
                                <TextInput
                                    type="text"
                                    id="sms-code"
                                    name="smsCode"
                                    maxLength={6}
                                    onChange={this.handleChange}
                                    validated={
                                        this.state.errors.smsCode !== ""
                                        ? ValidatedOptions.error
                                        : ValidatedOptions.default
                                    }
                                >
                                </TextInput>
                                <Button
                                    id="send-sms-code"
                                    variant="secondary"
                                    onClick={this.handleSendSmsCode}
                                    disabled={this.state.sendSmsCodeBtnEnabled}
                                >
                                    {this.state.sendSmsCodeBtnLabel}
                                </Button>
                            </InputGroup>
                        </FormGroup>
                    </Form>
                </Modal>
            </React.Fragment>
        );
    }
}