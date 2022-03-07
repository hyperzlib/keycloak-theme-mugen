<#import "template.ftl" as layout>
<@layout.emailLayout bodyClass='test'; section>
    <#if section = "title">
        ${kcSanitize(msg("emailTestSubject"))?no_esc}
    <#elseif section = "preview">
        ${kcSanitize(msg("emailTestBody"))?no_esc}
    <#elseif section = "content">
        ${kcSanitize(msg("emailTestBodyHtml", realmName))?no_esc}
    </#if>
</@layout.emailLayout>
