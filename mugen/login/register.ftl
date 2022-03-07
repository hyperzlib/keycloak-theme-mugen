<#import "template.ftl" as layout>
<@layout.registrationLayout displayMessage=!messagesPerField.existsError('firstName','lastName','email','username','password','password-confirm'); section>
    <#if section = "action">
        <div id="kc-form-options" class="${properties.kcFormOptionsClass!}">
            <div class="${properties.kcFormOptionsWrapperClass!}">
                <span><a href="${url.loginUrl}">${kcSanitize(msg("backToLogin"))?no_esc}</a></span>
            </div>
        </div>
    <#elseif section = "header">
        ${msg("registerTitle")}
    <#elseif section = "form">
        <form id="kc-register-form" class="${properties.kcFormClass!}" action="${url.registrationAction}" method="post">
            <#if !realm.registrationEmailAsUsername>
                <div class="${properties.kcFormGroupClass!}">
                    <div class="${properties.kcLabelWrapperClass!}">
                        <label for="username" class="${properties.kcLabelClass!}"><span class="required">*</span> ${msg("username")}</label>
                    </div>
                    <div class="${properties.kcInputWrapperClass!}">
                        <input type="text" id="username" class="${properties.kcInputClass!}" name="username"
                            value="${(register.formData.username!'')}" autocomplete="username"
                            aria-invalid="<#if messagesPerField.existsError('username')>true</#if>"
                        />

                        <span class="pf-c-form__helper-text" aria-live="polite">
                            ${msg("usernameWillPublicWarning")}
                        </span>
                        <#if messagesPerField.existsError('username')>
                            <span id="input-error-username" class="${properties.kcInputErrorMessageClass!}" aria-live="polite">
                                ${kcSanitize(messagesPerField.get('username'))?no_esc}
                            </span>
                        </#if>
                    </div>
                </div>
            </#if>

            
            <ul class="nav nav-pills nav-justified" role="tablist">
                <li role="presentation" class="active">
                    <a href="#kc-register-email" aria-controls="home" role="tab" data-toggle="tab" data-credential-type="email">${msg("registerByEmail")}</a>
                </li>
                <li role="presentation">
                    <a href="#kc-register-phone" aria-controls="home" role="tab" data-toggle="tab" data-credential-type="phone">${msg("registerByPhone")}</a>
                </li>
            </ul>
            <input type="hidden" name="credentialType" id="credentialType" value="email">
            <div class="tab-content">
                <div id="kc-register-email" role="tabpanel" class="tab-pane active fade in">
                    <div class="${properties.kcFormGroupClass!}">
                        <div class="${properties.kcLabelWrapperClass!}">
                            <label for="email" class="${properties.kcLabelClass!}"><span class="required">*</span> ${msg("email")}</label>
                        </div>
                        <div class="${properties.kcInputWrapperClass!}">
                            <input type="text" id="email" class="${properties.kcInputClass!}" name="email"
                                value="${(register.formData.email!'')}" autocomplete="email"
                                aria-invalid="<#if messagesPerField.existsError('email')>true</#if>"
                            />

                            <#if messagesPerField.existsError('email')>
                                <span id="input-error-email" class="${properties.kcInputErrorMessageClass!}" aria-live="polite">
                                    ${kcSanitize(messagesPerField.get('email'))?no_esc}
                                </span>
                            </#if>
                        </div>
                    </div>

                    <#if passwordRequired??>
                        <div class="${properties.kcFormGroupClass!}">
                            <div class="${properties.kcLabelWrapperClass!}">
                                <label for="password" class="${properties.kcLabelClass!}"><span class="required">*</span> ${msg("password")}</label>
                            </div>
                            <div class="${properties.kcInputWrapperClass!}">
                                <input type="password" id="password" class="${properties.kcInputClass!}" name="password"
                                    autocomplete="new-password"
                                    aria-invalid="<#if messagesPerField.existsError('password','password-confirm')>true</#if>"
                                />

                                <#if messagesPerField.existsError('password')>
                                    <span id="input-error-password" class="${properties.kcInputErrorMessageClass!}" aria-live="polite">
                                        ${kcSanitize(messagesPerField.get('password'))?no_esc}
                                    </span>
                                </#if>
                            </div>
                        </div>

                        <div class="${properties.kcFormGroupClass!}">
                            <div class="${properties.kcLabelWrapperClass!}">
                                <label for="password-confirm"
                                    class="${properties.kcLabelClass!}"><span class="required">*</span> ${msg("passwordConfirm")}</label>
                            </div>
                            <div class="${properties.kcInputWrapperClass!}">
                                <input type="password" id="password-confirm" class="${properties.kcInputClass!}"
                                    name="password-confirm"
                                    aria-invalid="<#if messagesPerField.existsError('password-confirm')>true</#if>"
                                />

                                <#if messagesPerField.existsError('password-confirm')>
                                    <span id="input-error-password-confirm" class="${properties.kcInputErrorMessageClass!}" aria-live="polite">
                                        ${kcSanitize(messagesPerField.get('password-confirm'))?no_esc}
                                    </span>
                                </#if>
                            </div>
                        </div>
                    </#if>
                </div>
                <div id="kc-register-phone" role="tabpanel" class="tab-pane fade">
                    <div class="${properties.kcFormGroupClass!}">
                        <div class="${properties.kcLabelWrapperClass!}">
                            <label for="phoneNumberInput" class="${properties.kcLabelClass!}"><span class="required">*</span> ${msg("phoneNumber")}</label>
                        </div>
                        <div class="${properties.kcInputWrapperClass!}">
                            <div class="input-group">
                                <span class="input-group-btn">
                                    <select tabindex="1" id="areaCodeInput" name="areaCode" class="${properties.kcInputClass!}" data-value="${(register.formData.areaCode!'')}">
                                    </select>
                                </span>
                                <input tabindex="2" id="phoneNumberInput" class="${properties.kcInputClass!}" name="phoneNumber" value="${(register.formData.phoneNumber!'')}" type="tel" />
                            </div>
                            <span id="phoneNumberInputError" class="${properties.kcInputErrorMessageClass!}" aria-live="polite"></span>
                        </div>
                    </div>

                    <div class="${properties.kcFormGroupClass!}">
                        <div class="${properties.kcLabelWrapperClass!}">
                            <label for="loginCode" class="${properties.kcLabelClass!}"><span class="required">*</span> ${msg("smsVerificationCode")}</label>
                        </div>
                        <div class="${properties.kcInputWrapperClass!}">
                            <div class="input-group">
                                <input tabindex="3" type="text" maxlength="6" class="${properties.kcInputClass!} nospin" id="verificationCodeInput" name="smsCode"/>
                                <div class="input-group-btn">
                                    <button class="${properties.kcInputClass!} ${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} ${properties.kcButtonLargeClass!}" id="btnSendVerificationCode" type="button">
                                        ${msg("sendSmsBtn")}
                                    </button>
                                </div>
                            </div>
                            <#if messagesPerField.existsError('smsCode')>
                                <span id="input-error-sms-code" class="${properties.kcInputErrorMessageClass!}" aria-live="polite">
                                    ${kcSanitize(messagesPerField.get('smsCode'))?no_esc}
                                </span>
                            </#if>
                        </div>
                    </div>
                </div>
            </div>

            <div class="${properties.kcFormGroupClass!}">
                <div class="${properties.kcLabelWrapperClass!}">
                    <label for="firstName" class="${properties.kcLabelClass!}">${msg("nickName")} (${msg("optional")})</label>
                </div>
                <div class="${properties.kcInputWrapperClass!}">
                    <input type="text" id="firstName" class="${properties.kcInputClass!}" name="firstName"
                        value="${(register.formData.firstName!'')}"
                        aria-invalid="<#if messagesPerField.existsError('firstName')>true</#if>"
                    />

                    <#if messagesPerField.existsError('firstName')>
                        <span id="input-error-firstname" class="${properties.kcInputErrorMessageClass!}" aria-live="polite">
                            ${kcSanitize(messagesPerField.get('firstName'))?no_esc}
                        </span>
                    </#if>
                </div>
            </div>

            <#if recaptchaRequired??>
                <div class="form-group">
                    <div class="${properties.kcInputWrapperClass!}">
                        <div class="g-recaptcha" data-size="compact" data-sitekey="${recaptchaSiteKey}"></div>
                    </div>
                </div>
            </#if>

            <div class="${properties.kcFormGroupClass!}">
                <div id="kc-form-buttons" class="${properties.kcFormButtonsClass!}">
                    <input class="${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} ${properties.kcButtonBlockClass!} ${properties.kcButtonLargeClass!}" type="submit" value="${msg("doRegister")}"/>
                </div>
            </div>
            <div id="kc-info" class="${properties.kcSignUpClass!}">
                <div id="kc-info-wrapper" class="${properties.kcInfoAreaWrapperClass!}">
                    <div id="kc-logging-container">
                        <div id="kc-logging">
                            <span>${kcSanitize(msg("alreadyHaveAccount"))?no_esc} <a href="${url.loginUrl}">${kcSanitize(msg("doLogIn"))?no_esc}</a></span>
                        </div>
                    </div>
                </div>
            </div>
        </form>
        <script src="${url.resourcesPath}/js/sms-sender-form.js"></script>
        <script>
            var authUrl = '${properties.authUrl}';
            var realm = '${realm.name}';
            var isReactLoading = false;

            Message.makeGlobal({
                "error": "错误",
                "captchaLoadError": "无法加载验证码，请刷新重试",
                "captchaCodeApiError": "无法访问Api",
                "countryNameLangCode": "zh-cn",
                "sending": "正在发送...",
                "sendVerificationCode": "发送验证码",
                "resendVerificationCode": "重新发送",
                "second": "秒",
                "phoneNumberIsEmpty": "请填写手机号码",
                "cannotGetConfig": "无法读取配置文件",
                "sendVerificationError": "发送短信验证码出错: {0}",
            });

            window.SmsSenderForm = new SmsSenderForm("registration", "#kc-register-form");

            $('#kc-register-form ul[role="tablist"] a[role="tab"]').on('shown.bs.tab', function(){
                $('#credentialType').val($(this).attr('data-credential-type'));
            });
        </script>
    </#if>
</@layout.registrationLayout>