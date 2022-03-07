<#import "template.ftl" as layout>
<@layout.emailLayout bodyClass='remove-totp-event'; section>
    <#if section = "title">
        ${kcSanitize(msg("eventRemoveTotpSubject"))?no_esc}
    <#elseif section = "preview">
        ${kcSanitize(msg("eventRemoveTotpBody",event.date,event.ipAddress))?no_esc}
    <#elseif section = "content">
        ${kcSanitize(msg("eventRemoveTotpBodyHtml",event.date,event.ipAddress))?no_esc}
    </#if>
</@layout.emailLayout>
