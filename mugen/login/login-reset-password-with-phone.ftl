<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=true displayMessage=!messagesPerField.existsError('username'); section>
    <#if section = "action">
        <div id="kc-form-options" class="${properties.kcFormOptionsClass!}">
            <div class="${properties.kcFormOptionsWrapperClass!}">
                <span><a href="${url.loginUrl}">${kcSanitize(msg("backToLogin"))?no_esc}</a></span>
            </div>
        </div>
    <#elseif section = "header">
        ${msg("emailForgotTitle")}
    <#elseif section = "form">
        <form id="kc-reset-password-form" class="${properties.kcFormClass!}" action="${url.loginAction}" method="post">
            <ul class="nav nav-pills nav-justified" role="tablist">
                <li role="presentation" class="active">
                    <a href="#kc-reset-password-email" aria-controls="home" role="tab" data-toggle="tab" data-reset-password-type="email">${msg("resetPasswordByEmail")}</a>
                </li>
                <li role="presentation">
                    <a href="#kc-reset-password-phone" aria-controls="home" role="tab" data-toggle="tab" data-reset-password-type="phone">${msg("resetPasswordByPhone")}</a>
                </li>
            </ul>
            <input type="hidden" name="resetPasswordType" id="resetPasswordType" value="email">
            <div class="tab-content">
                <div id="kc-reset-password-email" role="tabpanel" class="tab-pane active fade in">
                    <div class="${properties.kcFormGroupClass!}">
                        <div class="${properties.kcLabelWrapperClass!}">
                            <label for="username" class="${properties.kcLabelClass!}"><#if !realm.loginWithEmailAllowed>${msg("username")}<#elseif !realm.registrationEmailAsUsername>${msg("usernameOrEmail")}<#else>${msg("email")}</#if></label>
                        </div>
                        <div class="${properties.kcInputWrapperClass!}">
                            <#if auth?has_content && auth.showUsername()>
                                <input type="text" id="username" name="username" class="${properties.kcInputClass!}" autofocus value="${auth.attemptedUsername}" aria-invalid="<#if messagesPerField.existsError('username')>true</#if>"/>
                            <#else>
                                <input type="text" id="username" name="username" class="${properties.kcInputClass!}" autofocus aria-invalid="<#if messagesPerField.existsError('username')>true</#if>"/>
                            </#if>

                            <#if messagesPerField.existsError('username')>
                                <span id="input-error-username" class="${properties.kcInputErrorMessageClass!}" aria-live="polite">
                                            ${kcSanitize(messagesPerField.get('username'))?no_esc}
                                </span>
                            </#if>
                        </div>
                    </div>
                </div>
                
                <div id="kc-reset-password-phone" role="tabpanel" class="tab-pane fade in">
                    <div class="${properties.kcFormGroupClass!}">
                        <div class="${properties.kcLabelWrapperClass!}">
                            <label for="phoneNumberInput" class="${properties.kcLabelClass!}">${msg("phoneNumber")}</label>
                        </div>
                        <div class="${properties.kcInputWrapperClass!}">
                            <div class="input-group">
                                <span class="input-group-btn">
                                    <select tabindex="1" id="areaCodeInput" name="areaCode" class="${properties.kcInputClass!}">
                                    </select>
                                </span>
                                <input tabindex="2" id="phoneNumberInput" class="${properties.kcInputClass!}" name="phoneNumber" type="tel" />
                            </div>
                            <span id="phoneNumberInputError" class="${properties.kcInputErrorMessageClass!}" aria-live="polite"></span>
                        </div>
                    </div>

                    <div class="${properties.kcFormGroupClass!}">
                        <div class="${properties.kcLabelWrapperClass!}">
                            <label for="loginCode" class="${properties.kcLabelClass!}">${msg("smsVerificationCode")}</label>
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
                            <#if messagesPerField.existsError('sms-code')>
                                <span id="input-error-sms-code" class="${properties.kcInputErrorMessageClass!}" aria-live="polite">
                                    ${kcSanitize(messagesPerField.get('sms-code'))?no_esc}
                                </span>
                            </#if>
                        </div>
                    </div>
                </div>
            </div>

            <div class="${properties.kcFormGroupClass!} ${properties.kcFormSettingClass!}">
                <div id="kc-form-buttons" class="${properties.kcFormButtonsClass!}">
                    <input class="${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} ${properties.kcButtonBlockClass!} ${properties.kcButtonLargeClass!}" type="submit" value="${msg("doSubmit")}"/>
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

            window.SmsSenderForm = new SmsSenderForm("reset", "#kc-reset-password-form");

            $('#kc-reset-password-form ul[role="tablist"] a[role="tab"]').on('shown.bs.tab', function(){
                $('#resetPasswordType').val($(this).attr('data-reset-password-type'));
            });
        </script>
    <#elseif section = "info" >
        ${msg("emailInstruction")}
    </#if>
</@layout.registrationLayout>
