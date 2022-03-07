<#import "template.ftl" as layout>
<@layout.emailLayout bodyClass='reset-password'; section>
    <#if section = "title">
        ${kcSanitize(msg("passwordResetSubject"))?no_esc}
    <#elseif section = "preview">
        ${kcSanitize(msg("passwordResetPreview"))?no_esc}
    <#elseif section = "content">
        ${kcSanitize(msg("passwordResetBodyDescription", link, linkExpiration, realmName, linkExpirationFormatter(linkExpiration)))?no_esc}
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
            <tbody>
            <tr>
                <td align="left">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    <tbody>
                    <tr>
                        <td> <a href="${link}" target="_blank">${kcSanitize(msg("passwordResetButton"))?no_esc}</a> </td>
                    </tr>
                    </tbody>
                </table>
                </td>
            </tr>
            </tbody>
        </table>
        ${kcSanitize(msg("passwordResetBodyInfo", link, linkExpiration, realmName, linkExpirationFormatter(linkExpiration)))?no_esc}
    </#if>
</@layout.emailLayout>