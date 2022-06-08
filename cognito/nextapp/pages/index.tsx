import type { NextPage } from 'next';
import { useCallback, useEffect, useState } from 'react';
import LoginForm from '../components/LoginForm';
import styled from 'styled-components';
import SignupForm from '../components/SignupForm';
import userPool from '../src/userPool';
import { CognitoUser } from 'amazon-cognito-identity-js';

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
            setUserId(username);
        }
    }, []);

    const logOut = useCallback(() => {
        const currentUser = userPool.getCurrentUser();
		console.log('currentUser: ', currentUser);
		console.log('userId:', session);
		console.log('token:', session);
		console.log('session:', session);
		if(1) {
			currentUser?.signOut(() => {
					setUserId(null);
			});
		} else {
			currentUser.setSignInUserSession(session) // This one raise the Exception: TypeError: Cannot read property 'getToken' of undefined
			console.log('currentUser after set session: ', currentUser);
			currentUser.globalSignOut({
				onSuccess: function(result) {console.log(result)},
				onFailure: function(err) {console.log(err)}
			})
		}
        // currentUser.globalSignOut(token, function(err, data) {
		//         if (err) console.log(err, err.stack); // an error occurred
		//         else     console.log(data);           // successful response
		//         setUserId(null);
        // });

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
                </div>
            ) : (
                <>{signupCheck ? <LoginForm goSignup={turnOver} setUserId={setUserId} setToken={setToken} setSession={setSession}/> : <SignupForm goLogin={turnOver} />}</>
            )}
        </Container>
    );
};

export default Index;
