<#import "template.ftl" as layout>
<@layout.registrationLayout displayMessage=!messagesPerField.existsError('username','password') displayInfo=realm.password && realm.registrationAllowed && !registrationDisabled??; section>
    <#if section = "header">
        ${msg("loginAccountTitle")}
    <#elseif section = "form">
    <div id="kc-form">
      <div id="kc-form-wrapper">
        <#if realm.password>
            <form id="kc-form-login" onsubmit="login.disabled = true; return true;" action="${url.loginAction}" method="post">
                <ul class="nav nav-pills nav-justified" role="tablist">
                    <li role="presentation" class="active">
                        <a href="#kc-login-password" aria-controls="home" role="tab" data-toggle="tab" data-login-type="password">${msg("loginByUsername")}</a>
                    </li>
                    <li role="presentation">
                        <a href="#kc-login-phone" aria-controls="home" role="tab" data-toggle="tab" data-login-type="phone">${msg("loginByPhone")}</a>
                    </li>
                </ul>
                <input type="hidden" name="loginType" id="loginType" value="password">
                <div class="tab-content">
                    <div id="kc-login-password" role="tabpanel" class="tab-pane active fade in">
                        <div class="${properties.kcFormGroupClass!}">
                            <label for="username" class="${properties.kcLabelClass!}"><#if !realm.loginWithEmailAllowed>${msg("username")}<#elseif !realm.registrationEmailAsUsername>${msg("usernameOrEmail")}<#else>${msg("email")}</#if></label>

                            <#if usernameEditDisabled??>
                                <input tabindex="1" id="username" class="${properties.kcInputClass!}" name="username" value="${(login.username!'')}" type="text" disabled />
                            <#else>
                                <input tabindex="1" id="username" class="${properties.kcInputClass!}" name="username" value="${(login.username!'')}"  type="text" autofocus autocomplete="off"
                                    aria-invalid="<#if messagesPerField.existsError('username','password')>true</#if>"
                                />

                                <#if messagesPerField.existsError('username','password')>
                                    <span id="input-error" class="${properties.kcInputErrorMessageClass!}" aria-live="polite">
                                            ${kcSanitize(messagesPerField.getFirstError('username','password'))?no_esc}
                                    </span>
                                </#if>
                            </#if>
                        </div>

                        <div class="${properties.kcFormGroupClass!}">
                            <label for="password" class="${properties.kcLabelClass!}">${msg("password")}</label>

                            <input tabindex="2" id="password" class="${properties.kcInputClass!}" name="password" type="password" autocomplete="off"
                                aria-invalid="<#if messagesPerField.existsError('username','password')>true</#if>"
                            />
                        </div>
                    </div>
                    
                    <div id="kc-login-phone" role="tabpanel" class="tab-pane fade">
                        <div class="${properties.kcFormGroupClass!}">
                            <label for="phoneNumberInput" class="${properties.kcLabelClass!}">${msg("phoneNumber")}</label>
                            <div class="input-group">
                                <span class="input-group-btn">
                                    <select tabindex="1" id="areaCodeInput" name="areaCode" class="${properties.kcInputClass!}" data-value="${(login.areaCode!'')}">
                                    </select>
                                </span>
                                <input tabindex="2" id="phoneNumberInput" class="${properties.kcInputClass!}" name="phoneNumber" value="${(login.phoneNumber!'')}" type="tel" />
                            </div>
                            <span id="phoneNumberInputError" class="${properties.kcInputErrorMessageClass!}" aria-live="polite">
                                <#if messagesPerField.existsError('phone-number')>
                                    ${kcSanitize(messagesPerField.getFirstError('phone-number'))?no_esc}
                                </#if>
                            </span>
                        </div>

                        <div class="${properties.kcFormGroupClass!}">
                            <label for="loginCode" class="${properties.kcLabelClass!}">${msg("smsVerificationCode")}</label>
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
                                    ${kcSanitize(messagesPerField.getFirstError('sms-code'))?no_esc}
                                </span>
                            </#if>
                        </div>
                    </div>
                </div>

                <div class="${properties.kcFormGroupClass!} ${properties.kcFormSettingClass!}">
                    <div id="kc-form-options">
                        <#if realm.rememberMe && !usernameEditDisabled??>
                            <div class="checkbox">
                                <label>
                                    <#if login.rememberMe??>
                                        <input tabindex="3" id="rememberMe" name="rememberMe" type="checkbox" checked> ${msg("rememberMe")}
                                    <#else>
                                        <input tabindex="3" id="rememberMe" name="rememberMe" type="checkbox"> ${msg("rememberMe")}
                                    </#if>
                                </label>
                            </div>
                        </#if>
                        </div>
                        <div class="${properties.kcFormOptionsWrapperClass!}">
                            <#if realm.resetPasswordAllowed>
                                <span><a tabindex="5" href="${url.loginResetCredentialsUrl}">${msg("doForgotPassword")}</a></span>
                            </#if>
                        </div>

                  </div>

                  <div id="kc-form-buttons" class="${properties.kcFormGroupClass!}">
                      <input type="hidden" id="id-hidden-input" name="credentialId" <#if auth.selectedCredential?has_content>value="${auth.selectedCredential}"</#if>/>
                      <input tabindex="4" class="${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} ${properties.kcButtonBlockClass!} ${properties.kcButtonLargeClass!}" name="login" id="kc-login" type="submit" value="${msg("doLogIn")}"/>
                  </div>
            </form>
        </#if>
        </div>

        <#if realm.password && social.providers??>
            <div id="kc-social-providers" class="${properties.kcFormSocialAccountSectionClass!}">
                <hr/>
                <h4>${msg("identity-provider-login-label")}</h4>

                <ul class="${properties.kcFormSocialAccountListClass!} <#if social.providers?size gt 3>${properties.kcFormSocialAccountListGridClass!}</#if>">
                    <#list social.providers as p>
                        <a id="social-${p.alias}" class="${properties.kcFormSocialAccountListButtonClass!} <#if social.providers?size gt 3>${properties.kcFormSocialAccountGridItem!}</#if>"
                                type="button" href="${p.loginUrl}">
                            <#if p.iconClasses?has_content>
                                <i class="${properties.kcCommonLogoIdP!} ${p.iconClasses!}" aria-hidden="true"></i>
                                <span class="${properties.kcFormSocialAccountNameClass!} kc-social-icon-text">${p.displayName!}</span>
                            <#else>
                                <span class="${properties.kcFormSocialAccountNameClass!}">${p.displayName!}</span>
                            </#if>
                        </a>
                    </#list>
                </ul>
            </div>
        </#if>

    </div>
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
            "sendSmsCodeError": "无法发送短信验证码，请联系网站管理员",
            "areaNotSupported": "不支持此区域的手机",
            "captchaNotCompleted": "请通过人机验证",
            "cannotGetConfig": "无法读取配置文件",
            "userNotExists": "用户不存在",
            "sendVerificationError": "发送短信验证码出错: {0}",
        });

        window.SmsSenderForm = new SmsSenderForm("login", "#kc-form-login");

        $('#kc-form-login ul[role="tablist"] a[role="tab"]').on('shown.bs.tab', function(){
            $('#loginType').val($(this).attr('data-login-type'));
        });
    </script>
    <#elseif section = "info" >
        <#if realm.password && realm.registrationAllowed && !registrationDisabled??>
            <div id="kc-registration-container">
                <div id="kc-registration">
                    <span>${msg("noAccount")}<a tabindex="6"
                                                 href="${url.registrationUrl}">${msg("doRegister")}</a></span>
                </div>
            </div>
        </#if>
        <!--
        <#if realm.resetPasswordAllowed>
            <div id="kc-reset-password-container">
                <div id="kc-reset-password">
                    <span><a tabindex="5" href="${url.loginResetCredentialsUrl}">${msg("doForgotPassword")}</a></span>
                </div>
            </div>
        </#if>
        -->
    </#if>



</@layout.registrationLayout>
