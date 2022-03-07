<#import "template.ftl" as layout>
<@layout.emailLayout bodyClass='identity-provider-link'; section>
    <#if section = "title">
        ${kcSanitize(msg("identityProviderLinkSubject"))?no_esc}
    <#elseif section = "preview">
        ${kcSanitize(msg("identityProviderLinkPreview"))?no_esc}
    <#elseif section = "content">
        ${kcSanitize(msg("identityProviderLinkBodyDescription", identityProviderAlias, realmName, identityProviderContext.username, link, linkExpiration, linkExpirationFormatter(linkExpiration)))?no_esc}
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
            <tbody>
            <tr>
                <td align="left">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    <tbody>
                    <tr>
                        <td> <a href="${link}" target="_blank">${kcSanitize(msg("identityProviderLinkButton"))?no_esc}</a> </td>
                    </tr>
                    </tbody>
                </table>
                </td>
            </tr>
            </tbody>
        </table>
        ${kcSanitize(msg("identityProviderLinkBodyInfo", identityProviderAlias, realmName, identityProviderContext.username, link, linkExpiration, linkExpirationFormatter(linkExpiration)))?no_esc}
    </#if>
</@layout.emailLayout>
