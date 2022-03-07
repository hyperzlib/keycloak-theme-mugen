<#import "template.ftl" as layout>
<@layout.emailLayout bodyClass='verification'; section>
    <#if section = "title">
        ${kcSanitize(msg("emailVerificationSubject"))?no_esc}
    <#elseif section = "preview">
        ${kcSanitize(msg("emailVerificationPreview"))?no_esc}
    <#elseif section = "content">
        ${kcSanitize(msg("emailVerificationBodyDescription", link, linkExpiration, realmName, linkExpirationFormatter(linkExpiration)))?no_esc}
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
            <tbody>
            <tr>
                <td align="left">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    <tbody>
                    <tr>
                        <td> <a href="${link}" target="_blank">${kcSanitize(msg("emailVerificationButton"))?no_esc}</a> </td>
                    </tr>
                    </tbody>
                </table>
                </td>
            </tr>
            </tbody>
        </table>
        ${kcSanitize(msg("emailVerificationBodyInfo", link, linkExpiration, realmName, linkExpirationFormatter(linkExpiration)))?no_esc}
    </#if>
</@layout.emailLayout>
