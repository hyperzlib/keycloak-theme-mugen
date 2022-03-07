<#import "template.ftl" as layout>
<@layout.emailLayout bodyClass='execute-actions'; section>
    <#if section = "title">
        ${kcSanitize(msg("executeActionsSubject"))?no_esc}
    <#elseif section = "preview">
        ${kcSanitize(msg("executeActionsPreview"))?no_esc}
    <#elseif section = "content">
        ${kcSanitize(msg("executeActionsBodyDescription",link, linkExpiration, realmName, requiredActionsText, linkExpirationFormatter(linkExpiration)))?no_esc}
        <p>
            <#outputformat "plainText">
                <#assign requiredActionsText><#if requiredActions??><#list requiredActions><#items as reqActionItem>${msg("requiredAction.${reqActionItem}")}<#sep>, </#sep></#items></#list></#if></#assign>
            </#outputformat>
        </p>
        ${kcSanitize(msg("executeActionsBodyClickToAction",link, linkExpiration, realmName, requiredActionsText, linkExpirationFormatter(linkExpiration)))?no_esc}
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
            <tbody>
            <tr>
                <td align="left">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    <tbody>
                    <tr>
                        <td> <a href="${link}" target="_blank">${kcSanitize(msg("executeActionsButton"))?no_esc}</a> </td>
                    </tr>
                    </tbody>
                </table>
                </td>
            </tr>
            </tbody>
        </table>
        ${kcSanitize(msg("executeActionsBodyInfo",link, linkExpiration, realmName, requiredActionsText, linkExpirationFormatter(linkExpiration)))?no_esc}
    </#if>
</@layout.emailLayout>