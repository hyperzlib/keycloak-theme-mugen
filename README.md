# Keycloak Theme Mugen
A keycloak theme using by [Isekai Wiki](https://www.isekai.cn/)

## Supports for providers
- [hyperzlib/keycloak-phone-provider](https://github.com/hyperzlib/keycloak-phone-provider)
- [hyperzlib/keycloak-avatar-extension](https://github.com/hyperzlib/keycloak-avatar-extension)
- [hyperzlib/keycloak-broker-rememberme](https://github.com/hyperzlib/keycloak-broker-rememberme)

## Alternative
- Only leave single field for name (Full Name, will stored in ```firstName```)
- Remove user attributes on ```register``` and ```idp-review-user-profile``` page
- Provide a responsive theme for email (you may need to change the footer in ```email/html/template.ftl```)

## Build
Enter ```keycloak.v2/account/src``` and run
```shell
npm i
```

Enter ```keycloak.v2/account``` and run
```shell
npm i
npm run build
```

The compilation results will be stored in ```mugen``` folder

## Deploy
Upload ```keycloak``` and ```mugen``` folder into ```theme``` folder
