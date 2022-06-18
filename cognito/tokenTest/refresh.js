const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const { CognitoUserPool, CognitoRefreshToken, CognitoUser } =
    AmazonCognitoIdentity;
const AWS = require('aws-sdk');
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
    region: 'ap-northeast-2', // Why do I need this? Its in .AWS/config
});
const { Headers } = fetch;

// const CognitoUserSession =
//     require('amazon-cognito-identity-js-node').CognitoUserSession;
// const CognitoUser = require('amazon-cognito-identity-js-node').CognitoUser;
// const CognitoIdToken =
//     require('amazon-cognito-identity-js-node').CognitoIdToken;
// const CognitoAccessToken =
//     require('amazon-cognito-identity-js-node').CognitoAccessToken;

const ClientId = '4nd20k5krb4pfmpml04iac9od2';
const UserPoolId = 'ap-northeast-2_fjpCRcTLM';
const userId = 'kiho.choi@lge.com';
const password = 'asdfqwer!@34';
const REFRESH_TOKEN =
    'eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ.vPa90vyUA6mnF0b47fLTfQbZduBysmC7s6UFfcWaabNmvo9LsgDgDkozwoXdwzOotKFNNWWXzTiYEP_D09WZcC3njZeXnfpicaoJ8Ug2HF1-f3WMN2TYh5WIbdpwPg-6ud0LJPPtsl15-OGat-bP7xnkT73lN8oBhJUmZhBkQm_r9I9fSdc-ExxOXcJDVwhea8pKlr5-aBmzYnk0yqLgeEgsYctWJ0xpocEap79onJz4kOlmW4HUIwywn23VP8AF863qRgpg-5JLXC-BrgRIKLbmSBY4taJVFb88fy1PgG65p3h218OvmaPVXaI8P_Wkz2KTKqllbTCLRh8fi3l5jQ.VvjjuoAxltQosbml.I3LX14Rqa_uMbLzJTjBnqKDYSpVtw8G1JF_AonUid9c-uu4UATMRnMMJdU-7PIYKr9AXmPlDr2D-rvKWDQ1lFtYf3vBU1G-2EzjXBt9iFOVgtk5B8qZOikHVwObvdEf921Hmtu_MdqaUU2jj8G58L3fKJ3cxWYsN2Bdbe2o8YOcaaWe33pU7ZbKoOfTl5IAYA53sv9bbcvUmM8Eh6sfB3rQwfSaZqNi55OLsjYvO-P3yv88PBHtjL326y8ykz5k7gadKGUTDrFdDwJJyZwdXkm_F04QWKJbihUJJEmIFIVFRRjUlcRw5oSThyN1Fck_f9WfWKAAtz4f2SNUCE62isLJREAdNQCztm1X4wVG4qgWWYSbxLcsfOBXNSujeLhrvKLxKMzvsBbIwa8nO4BWtR3t-AeKf8Ve-JNVyowJ4Y-Ds770pnTAvRDqCZCD34G0yiLvvhx_1NdyNZ21F7oi4n33xgTrW0td3W3969MUddsWxJyEC1GXeuMPKZqKjJq29Bi1Mb0luyRtrPHqQwmA8RXkJtn4zrGJjMwm128xw1nPIeR-Ttpr0Lwi0LTm488RnoiEs9DZi5VM20qAeN3l-2TSQWWcEqI9bLQSBeumKZSHQKSsWPJXeOJgV6TAWQDU-2TDfwH3xVx1emsco53PB1DVn1xjKjlZNQnQwx8JSOMj29ZOxfBwJKIItnwFAe1d3b8iaBm4U7v9Dtx0qx7_SyzoJw4JO0yohl7mlsswDKvz9trooFuiKAAheGbJP0_CgG28M_ioBtwxOLHxCkzNDbMiig0UbYEV3TkHoPZH4VIW9VZH7P4N2EYQxgZBZcpNRt984TCdckou5-S_TqUI6AdTzXt0KArR1kt8t2BoUkhPx_ycfg3ArcV_Hxr5LAV-3Bu8lFyNvsI98RbMV2IQAXKLimJqiTYSPrEj6VUyhEkFbRp4yo-a8jbmFj2x9waIA3xH6pb1megR2UhhubdlzRvL84uV25_23vPIGfUVAzEEkBxZGbrsQgUeIZeydlFoDaEy4y1B3nFt5Z7focWjOkWE3Itxd-QL482d_sPpCzCaFZ5f3pY3v3MX9aN2mu9FBveRQOhamSKz8tnUPoaw4tP1MmXTnUqsuNiYVHDxmOCJ1epHbQmUUMAiv9tITDm33WkFpqBwCqEKNvVTVOU7YghvoZwmS__pgkqRGuSpfPWvam4Deu9A1AtSdQMqjuhuAu6dT3YSNLITEp34cJG9qZLCL1Gt77jO4vKvCjOTGy7e2XJE8QWjwHokA6nbvTRJbObNLGelCjS7b3tZsuEzbVCq2BStJbozVR_8jjU2ynmfHHKkdpS-cN422ok6m1DrLuaZg7_oS3_PGYg.XaATCDbhi2o6FUNzj8KirQ';

const userpoolData = {
    UserPoolId: 'ap-northeast-2_fjpCRcTLM',
    ClientId: '4nd20k5krb4pfmpml04iac9od2',
};
const userPool = new CognitoUserPool(userpoolData);

let cognitoUser = userPool.getCurrentUser();

// const getCognitoUser = function (userId) {
//     const poolData = {
//         UserPoolId,
//         ClientId,
//     };
//     const userPool = new CognitoUserPool(poolData);
//     const userData = {
//         Username: userId,
//         Pool: userPool,
//     };
//     return new CognitoUser(userData);
// };
//
// async function getRefreshToken(cognitoUser) {
//     // if we found a user
//     return new Promise((res, rej) => {
//         if (cognitoUser != null) {
//             // get active user session
//             cognitoUser.getSession(function (err, session) {
//                 // catch errors
//                 if (err) {
//                     return;
//                 }
//
//                 // get the refresh token
//                 console.log('getRefreshToken, session: ', session);
//                 return session.refreshToken.token;
//             });
//         }
//     });
// }
//
// async function logout(userId) {
//     const currentUser = getCognitoUser(userId);
//     console.log(currentUser);
//     return new Promise((res, rej) => {
//         if (0) {
//             currentUser?.signOut((data) => {
//                 console.log('in signOut:', data);
//                 return data;
//             });
//         } else {
//             currentUser.globalSignOut({
//                 onSuccess: function (result) {
//                     console.log(result);
//                     return result;
//                 },
//                 onFailure: function (err) {
//                     console.log(err);
//                 },
//             });
//         }
//     });
// }
//
// // For logging
// async function login() {
//     return new Promise((res, rej) => {
//         const params = {
//             AuthFlow: 'ADMIN_NO_SRP_AUTH',
//             ClientId,
//             UserPoolId,
//             AuthParameters: {
//                 USERNAME: username,
//                 PASSWORD: password,
//             },
//         };
//         cognitoidentityserviceprovider.adminInitiateAuth(
//             params,
//             function (err, data) {
//                 if (err) {
//                     console.log(err);
//                     return rej(err);
//                 }
//                 console.log(data);
//                 return data;
//             }
//         );
//     });
// }
//
// For refreshing the token:

async function refresh() {
    return new Promise((res, rej) => {
        const params = {
            AuthFlow: 'REFRESH_TOKEN_AUTH',
            ClientId,
            UserPoolId,
            AuthParameters: {
                REFRESH_TOKEN,
            },
        };
        cognitoidentityserviceprovider.adminInitiateAuth(
            params,
            function (err, data) {
                if (err) {
                    console.log(err);
                    return rej(err);
                }
                console.log(data);

                return data;
            }
        );
    });
}

async function refresh2() {
    const client = new AWS.CognitoIdentityServiceProvider({
        region: 'ap-northeast-2', // Why do I need this? Its in .AWS/config
    });
    // const client = new AWS.CognitoIdentityProvider({
    //     region: 'ap-northeast-2',
    // });
    const refreshToken = new CognitoRefreshToken({
        RefreshToken: REFRESH_TOKEN,
    });
    console.log(refreshToken);

    return new Promise((res, rej) => {
        client
            .initiateAuth({
                AuthFlow: 'REFRESH_TOKEN_AUTH',
                ClientId,
                AuthParameters: {
                    REFRESH_TOKEN: refreshToken,
                },
            })
            .then((w) => {
                console.log(w);
                return true;
            });
    });
}
//
// const getTokens = function (session) {
//     return {
//         accessToken: session.getAccessToken().getJwtToken(),
//         idToken: session.getIdToken().getJwtToken(),
//         refreshToken: session.getRefreshToken().getToken(),
//     };
// };
//
// const checkTokenExpiration = async function (req, res, next) {
//     // const AccessToken = new CognitoAccessToken({
//     //     AccessToken: accessToken,
//     // });
//     // const IdToken = new CognitoIdToken({ IdToken: idToken });
//     const cognitoUser = getCognitoUser(userId);
//     const refreshToken = await getRefreshToken(cognitoUser);
//     const RefreshToken = new CognitoRefreshToken({
//         RefreshToken: refreshToken,
//     });
//     console.log('[checkTokenExpiration] RefreshToken: ', RefreshToken);
//     // const sessionData = {
//     //     IdToken: IdToken,
//     //     AccessToken: AccessToken,
//     //     RefreshToken: RefreshToken,
//     // };
//     // const cachedSession = new CognitoUserSession(sessionData);
//
//     console.log('[checkTokenExpiration] cognitoUser: ', cognitoUser);
//     cognitoUser.refreshSession(RefreshToken, (err, session) => {
//         if (err) throw err;
//         const tokens = getTokens(session);
//         console.log(tokens);
//     });
// };
const cognitoLoginUrl =
    'https://cognito-idp.ap-northeast-2.amazonaws.com/ap-northeast-2_fjpCRcTLM';
async function revokeToken() {
    // let params = {
    //     ClientId,
    //     Token: REFRESH_TOKEN,
    // };
    // return new Promise((res, rej) => {
    //     cognitoidentityserviceprovider.revokeToken(
    //         params,
    //         function (err, data) {
    //             if (err) console.log(err, err.stack);
    //             // an error occurred
    //             else console.log(data); // successful response
    //             return res(true);
    //         }
    //     );
    // });
    const res = await fetch(`${cognitoLoginUrl}/oauth2/revoke`, {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
        },
        body: Object.entries({
            token: REFRESH_TOKEN,
            client_id: ClientId,
        })
            .map(([k, v]) => `${k}=${v}`)
            .join('&'),
    });
    console.log(res);
    if (!res.ok) {
        console.log('Error!');
    }
}
async function main() {
    if (1) {
        await revokeToken();
    } else {
        await refresh();
    }
    // await logout(userId);
    // await refresh2();
    // await login();
    // await checkTokenExpiration();
    // await getRefreshToken(getCognitoUser());
}

main();
