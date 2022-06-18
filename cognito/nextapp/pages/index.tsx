import type { NextPage } from 'next';
import { useCallback, useEffect, useState } from 'react';
import LoginForm from '../components/LoginForm';
import styled from 'styled-components';
import SignupForm from '../components/SignupForm';
import userPool from '../src/userPool';
import { CognitoUser, GlobalSignOutRequest } from 'amazon-cognito-identity-js';
// import { Auth } from 'aws-amplify';

const cognitoLoginUrl = 'https://redcapmobility.auth.ap-northeast-2.amazoncognito.com';
const Container = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;

    width: 360px;
    height: 432px;
    background-color: #fff;
    border-radius: 6px;
    .context {
        padding: 24px;
        position: absolute;
        top: 25%;
        width: 100%;
        height: 50%;
        button {
            width: 100%;
            height: 48px;
            border: 1px solid;
            border-color: #3b613b;
            border-radius: 4px;
            font-weight: 600;
            background-color: #3b613b;
            cursor: pointer;
            color: #fff;
            margin-top: 12px;
        }
    }
`;

const printData = (currentUser) => {
	currentUser.getSession((err, data) => {
		if(data) {
			console.log(data);
			console.log(
					'idToken: ', data.getIdToken()?.getJwtToken());
			console.log(
					'AccessToken: ', data.getAccessToken()?.getJwtToken());
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
	})
}

const Index: NextPage = () => {
    const [signupCheck, setSignupCheck] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [session, setSession] = useState();
    // const turnOver = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    //     e.preventDefault();
    //     setSignupCheck((prev) => !prev);
    // }, []);
    const turnOver = useCallback(() => {
        setSignupCheck((prev) => !prev);
    }, []);

    useEffect(() => {
        class newCognitoUser extends CognitoUser {
            public storage?: any;
        }
        const currentUser: newCognitoUser | null = userPool.getCurrentUser();
		console.log('currentUser:' ,currentUser);
        if (currentUser) {
            const { username } = currentUser;
			console.log('index:', username);
			printData(currentUser);
			currentUser.getSession(function(err, data) {
				if (err) {
					// Prompt the user to reauthenticate by hand...
				} else {
					const cognitoUserSession = data;
					const yourIdToken = cognitoUserSession.getIdToken().jwtToken;
					const yourAccessToken = cognitoUserSession.getAccessToken().jwtToken;
					console.log('AccessToken: ', yourAccessToken);
					console.log('Session: ', data);
					setSession(data);
				}
			});
			setUserId(username);
        }
    }, []);

	const refreshToken = () => {
		console.log('userId: param', userId);
		console.log('session: param', session);
	};
    //     const currentUser = userPool.getCurrentUser();
	//     console.log('currentUser param: ', currentUser);
	//     console.log('userId: param', userId);
	//     console.log('token: param', token);
	//     console.log('session: param', session);
	//     printData(currentUser);
	//     switch(1) {
	//     case 0: {
	//         console.log('=============== signOut =============');
	//         currentUser?.signOut(() => {
	//                 setUserId(null);
	//         });
	//         break;
	//     }
	//     case 1: {
	//         // currentUser.setSignInUserSession(session) // This one raise the Exception: TypeError: Cannot read property 'getToken' of undefined
	//         console.log('=============== globalSignOut =============');
	//         console.log('currentUser after set session: ', currentUser);
	//         currentUser.refreshSession(refresh{
	//             onSuccess: function(result) {
	//                 console.log(result);
	//                 setUserId(null);
	//             },
	//             onFailure: function(err) {
	//                 console.log(err)
	//                 setUserId(null);
	//             }
	//         })
	//         break;
    //
	//     }
	//     case 2: {
	//         // currentUser.setSignInUserSession(session) // This one raise the Exception: TypeError: Cannot read property 'getToken' of undefined
	//         console.log('=============== revoke =============');
	//         console.log('currentUser after set session: ', currentUser);
	//         currentUser.revoke({
	//             onSuccess: function(result) {
	//                 console.log(result);
	//                 setUserId(null);
	//             },
	//             onFailure: function(err) {
	//                 console.log(err)
	//                 setUserId(null);
	//             }
	//         })
	//         break;
	//     }
	//     }
	//     // console.log('token:', token);
	//     // const param = {
	//     //     method: "POST",
	//     //     headers: {'Authorization': `Basic ${token}`, "Content-type": "application/x-www-form-urlencoded"},
	//     //     body: JSON.stringify({
	//     //         "client_id": "4nd20k5krb4pfmpml04iac9od2",
	//     //     })
	//     // }
	//     // console.log('param: ', param);
	//     // fetch(`${cognitoLoginUrl}/oauth2/revoke`, param}).then((res) => console.log(res));
    //
    // }, []);

    const logOut = useCallback(() => {
        const currentUser = userPool.getCurrentUser();
		console.log('currentUser param: ', currentUser);
		console.log('userId: param', userId);
		console.log('token: param', token);
		console.log('session: param', session);
		printData(currentUser);
		switch(1) {
		case 0: {
			console.log('=============== signOut =============');
			currentUser?.signOut(() => {
					setUserId(null);
			});
			break;
		}
		case 1: {
			// currentUser.setSignInUserSession(session) // This one raise the Exception: TypeError: Cannot read property 'getToken' of undefined
			console.log('=============== globalSignOut =============');
			console.log('currentUser after set session: ', currentUser);
			currentUser.globalSignOut({
				onSuccess: function(result) {
					console.log(result);
					setUserId(null);
				},
				onFailure: function(err) {
					console.log(err)
					setUserId(null);
				}
			})
			break;

		}
		case 2: {
			// currentUser.setSignInUserSession(session) // This one raise the Exception: TypeError: Cannot read property 'getToken' of undefined
			console.log('=============== revoke =============');
			console.log('currentUser after set session: ', currentUser);
			currentUser.revoke({
				onSuccess: function(result) {
					console.log(result);
					setUserId(null);
				},
				onFailure: function(err) {
					console.log(err)
					setUserId(null);
				}
			})
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

    }, []);

    return (
        <Container>
            {userId ? (
                <div className="context">
                    <h3>
                        {token}, {userId},<br />
                        로그인 완료
                    </h3>
                    <button onClick={logOut}>로그아웃</button>
                    <button onClick={refreshToken}>RefreshToken</button>
                </div>
            ) : (
                <>{signupCheck ? <LoginForm goSignup={turnOver} setUserId={setUserId} setToken={setToken} setSession={setSession}/> : <SignupForm goLogin={turnOver} />}</>
            )}
        </Container>
    );
};

export default Index;
