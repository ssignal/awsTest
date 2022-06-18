require('../global.js');
const AWS = require('aws-sdk');
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
    region: 'ap-northeast-2', // Why do I need this? Its in .AWS/config
});

const {
    CognitoUserPool,
    CognitoUser,
    // CognitoUserSession,
    AuthenticationDetails,
} = require('amazon-cognito-identity-js');

const userPool = new CognitoUserPool({
    UserPoolId: COGNITO_USERPOOLID,
    ClientId: COGNITO_CLIENTID,
});

const printData = (currentUser) => {
    return new Promise(() => {
        currentUser.getSession((err, data) => {
            if (data) {
                console.log(data);
                console.log('idToken: ', data.getIdToken().getJwtToken());
                console.log(
                    'AccessToken: ',
                    data.getAccessToken().getJwtToken()
                );
                console.log(
                    'auth_time :',
                    new Date(data.getAccessToken().payload.auth_time * 1000)
                );
                console.log(
                    'exp :',
                    new Date(data.getAccessToken().payload.exp * 1000)
                );
                console.log(
                    'iat :',
                    new Date(data.getAccessToken().payload.iat * 1000)
                );
            }

            return true;
        });
    });
};

function getTokensFromSession(session) {
    if (!session) return null;
    const tokens = {
        accessToken: _.get(session, 'accessToken.jwtToken'),
        idToken: _.get(session, 'idToken.jwtToken'),
        refreshToken: _.get(session, 'refreshToken.token'),
    };
    console.log('[getTokens] tokens: ', tokens);
    if (!tokens.accessToken || !tokens.idToken || !tokens.refreshToken)
        throw 'Cognito Error! token is not exist';
    return tokens;
}

const logOut = async (userId) => {
    return new Promise((resolve, reject) => {
        const currentUser = userPool.getCurrentUser();
        console.log('currentUser param: ', currentUser);
        console.log('userId: param', userId);
        printData(currentUser);
        switch (1) {
            case 0: {
                console.log('=============== signOut =============');
                currentUser.signOut(() => {});
                break;
            }
            case 1: {
                // currentUser.setSignInUserSession(session) // This one raise the Exception: TypeError: Cannot read property 'getToken' of undefined
                console.log('=============== globalSignOut =============');
                console.log('currentUser after set session: ', currentUser);
                currentUser.globalSignOut({
                    onSuccess: function (result) {
                        console.log(result);
                        return resolve(true);
                    },
                    onFailure: function (err) {
                        console.log(err);
                        return reject(err);
                    },
                });
                break;
            }
            case 2: {
                // currentUser.setSignInUserSession(session) // This one raise the Exception: TypeError: Cannot read property 'getToken' of undefined
                console.log('=============== revoke =============');
                console.log('currentUser after set session: ', currentUser);
                currentUser.revoke({
                    onSuccess: function (result) {
                        console.log(result);
                        return resolve(true);
                    },
                    onFailure: function (err) {
                        console.log(err);
                        return reject(err);
                    },
                });
                break;
            }
        }
        // console.log('token:', token);
        // const param = {
        //     method: "POST",
        //     headers: {'Authorization': `Basic ${token}`, "Content-type": "application/x-www-form-urlencoded"},
        //     body: JSON.stringify({
        //         "client_id": "4nd20k5krb4pfmpml04iac9od2",
        //     })
        // }
        // console.log('param: ', param);
        // fetch(`${cognitoLoginUrl}/oauth2/revoke`, param}).then((res) => console.log(res));
    });
};

const logIn = async (userId, password) => {
    const cognitoUser = new CognitoUser({
        Username: userId,
        Pool: userPool,
    });
    const authDetails = new AuthenticationDetails({
        Username: userId,
        Password: password,
    });
    return new Promise((resolve, reject) => {
        cognitoUser.authenticateUser(authDetails, {
            onSuccess: async function (result) {
                // const IdToken = result.idToken.jwtToken;
                // const accessToken = result.accessToken.jwtToken;
                // const RefreshToken = result.refreshToken.token;
                console.log('authenticateUser.result:', result);

                cognitoUser.setSignInUserSession(result); // This one raise the Exception: TypeError: Cannot read property 'getToken' of undefined
                console.log('session:', result);
                return resolve(getTokensFromSession(result));
            },
            onFailure: function (err) {
                console.log(err);
                // if (err.message == 'User is not confirmed.') {
                //     ('가입한 이메일을 인증해주세요.');
                // } else if (err.message == 'Incorrect username or password.') {
                //     alert('이메일 또는 비밀번호가 틀렸습니다.');
                // } else if (err.message == 'User does not exist.') {
                //     alert('존재하지 않는 사용자입니다.');
                // } else if (
                //     err.message.indexOf(
                //         'USER_SRP_AUTH is not enabled for the client'
                //     ) >= 0
                // ) {
                //     alert('등록되지 않은 사용자 입니다.');
                //     // eslint-disable-next-line
                //     goSignup(0);
                // }
                let message = null;
                if (
                    err.message.indexOf(
                        'USER_SRP_AUTH is not enabled for the client'
                    ) >= 0
                ) {
                    message = 'Id is not registered.';
                }

                return reject({
                    code: ERROR_CODE_BAD_REQUEST,
                    message: message || err.message,
                });
            },
        });
    });
};

const logInNOut = async (userId, password) => {
    console.log('[cognito.logInNOut]');
    let ret = await logIn(userId, password);
    if (ret) ret = await logOut(userId);

    return true;
};

async function refreshToken(token) {
    console.log('[cognito.refreshToken] token: ', token);
    // This line needed to refresh token
    // eslint-disable-next-line
	userPool.getCurrentUser();

    const params = {
        AuthFlow: 'REFRESH_TOKEN_AUTH',
        ClientId: COGNITO_CLIENTID,
        UserPoolId: COGNITO_USERPOOLID,
        AuthParameters: {
            REFRESH_TOKEN: token,
        },
    };

    // return new Promise((res) => {
    //     cognitoidentityserviceprovider.adminInitiateAuth(
    //         params,
    //         (err, data) => {
    //             if (err) throw err;
    //             console.log('[cognito.adminInitiateAuth] data: ', data);
    //
    //             const idToken = _.get(data, 'AuthenticationResult.IdToken');
    //             const accessToken = _.get(
    //                 data,
    //                 'AuthenticationResult.AccessToken'
    //             );
    //             if (!idToken || !accessToken)
    //                 throw 'Error! tokens are not returned';
    //             return res({ idToken, accessToken });
    //         }
    //     );
    // });

    const ret = await cognitoidentityserviceprovider
        .adminInitiateAuth(params)
        .promise();
    console.log('[cognito.refreshToken] ret: ', ret);
    const idToken = _.get(ret, 'AuthenticationResult.IdToken');
    const accessToken = _.get(ret, 'AuthenticationResult.AccessToken');
    if (!idToken || !accessToken) throw 'Error! tokens are not returned';

    return { idToken, accessToken };
}
// // For logging in:
// // const params = {
// //           AuthFlow: "ADMIN_NO_SRP_AUTH"
// //           ClientId: **clientApp1**
// //           UserPoolId: **UserPoolA**
// //           AuthParameters: {
// //             USERNAME: username,
// //             PASSWORD: password
// //           }
// //         }
// //         cognitoidentityserviceprovider.adminInitiateAuth(params, function (err, data) { }
//
// // For refreshing the token:
//
// const refreshToken = async (userId, refreshToken) => {
// const params = {
//     AuthFlow: 'REFRESH_TOKEN_AUTH',
//     ClientId: **clientApp2** ,
//     UserPoolId: CognitoUserPool,
//     AuthParameters: {
//       REFRESH_TOKEN: **refreshToken received from step 1 Login.**
//     }
//   }
//   cognitoidentityserviceprovider.adminInitiateAuth(params, function (err, data) { }
// }

module.exports = {
    logIn,
    logInNOut,
    logOut,
    refreshToken,
};
