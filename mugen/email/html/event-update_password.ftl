<#import "template.ftl" as layout>
<@layout.emailLayout bodyClass='update-password-event'; section>
    <#if section = "title">
        ${kcSanitize(msg("eventUpdatePasswordSubject"))?no_esc}
    <#elseif section = "preview">
        ${kcSanitize(msg("eventUpdatePasswordBody",event.date,event.ipAddress))?no_esc}
    <#elseif section = "content">
        ${kcSanitize(msg("eventUpdatePasswordBodyHtml",event.date,event.ipAddress))?no_esc}
    </#if>
</@layout.emailLayout>
