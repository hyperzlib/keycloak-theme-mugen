<#import "template.ftl" as layout>
<@layout.emailLayout bodyClass='update-totp-event'; section>
    <#if section = "title">
        ${kcSanitize(msg("eventUpdateTotpSubject"))?no_esc}
    <#elseif section = "preview">
        ${kcSanitize(msg("eventUpdateTotpBody",event.date,event.ipAddress))?no_esc}
    <#elseif section = "content">
        ${kcSanitize(msg("eventUpdateTotpBodyHtml",event.date,event.ipAddress))?no_esc}
    </#if>
</@layout.emailLayout>
