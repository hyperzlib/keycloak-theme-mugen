<#import "template.ftl" as layout>
<@layout.emailLayout bodyClass='login-error-event'; section>
    <#if section = "title">
        ${kcSanitize(msg("eventLoginErrorSubject"))?no_esc}
    <#elseif section = "preview">
        ${kcSanitize(msg("eventLoginErrorBody",event.date,event.ipAddress))?no_esc}
    <#elseif section = "content">
        ${kcSanitize(msg("eventLoginErrorBodyHtml",event.date,event.ipAddress))?no_esc}
    </#if>
</@layout.emailLayout>
