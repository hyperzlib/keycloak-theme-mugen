<#import "template.ftl" as layout>
<@layout.registrationLayout displayMessage=false displayInfo=false; section>
    <#if section = "header">
        ${msg("loginSuccessTitle")}
    <#elseif section = "form">
        <form id="kc-form-confirm-remember-me" action="${url.loginAction}" method="post">
            <input type="hidden" style="display: none;" name="rememberMe" id="rememberMe" value="on">
            <div class="${properties.kcFormGroupClass!}">
                <h3>${msg("shouldRememberMe")}</h3>
                <p>${msg("shouldRememberMeWarning")}</p>
            </div>
            <div class="${properties.kcFormGroupClass!} select-btn-group">
                <div class="row">
                    <div class="col-sm-6 btn-wrapper">
                        <button type="button" class="${properties.kcButtonClass!} ${properties.kcButtonDefaultClass!} ${properties.kcButtonBlockClass!} ${properties.kcButtonLargeClass!}" id="action-remember-off">
                            ${msg("doNo")}
                        </button>
                    </div>
                    <div class="col-sm-6 btn-wrapper">
                        <button type="button" class="${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} ${properties.kcButtonBlockClass!} ${properties.kcButtonLargeClass!}" id="action-remember-on" autofocus>
                            ${msg("doYes")}
                        </button>
                    </div>
                </div>
            </div>
        </form>
        <script>
            $("#action-remember-on").click(function(e) {
                e.preventDefault();
                $("#rememberMe").val("on");
                $("#kc-form-confirm-remember-me").submit();
            });

            $("#action-remember-off").click(function(e) {
                e.preventDefault();
                $("#rememberMe").val("off");
                $("#kc-form-confirm-remember-me").submit();
            });
        </script>
    </#if>
</@layout.registrationLayout>
