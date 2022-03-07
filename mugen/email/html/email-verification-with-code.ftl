<#import "template.ftl" as layout>
<@layout.emailLayout bodyClass='verification'; section>
    <#if section = "title">
        ${kcSanitize(msg("emailVerificationSubject"))?no_esc}
    <#elseif section = "preview">
        ${kcSanitize(msg("emailVerificationPreviewCode"))?no_esc}
    <#elseif section = "content">
        ${kcSanitize(msg("emailVerificationBodyCodeHtml"}
    </#if>
</@layout.emailLayout>
