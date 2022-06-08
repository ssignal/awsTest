import React, { Dispatch, SetStateAction, useCallback, useState } from 'react';
import styled from 'styled-components';
import userPool from '../src/userPool';
import { CognitoUser, CognitoUserSession, AuthenticationDetails } from 'amazon-cognito-identity-js';

const LoginFormContainer = styled.div`
    h1 {
        text-align: center;
    }
    .loginFormBox {
        padding: 24px;
        position: absolute;
        width: 100%;
        height: 100%;

        .inputContainer {
            margin-bottom: 12px;
            input {
                padding: 13px 12px;
                width: 100%;
                height: 48px;
                line-height: 1.47;
                font-size: 15px;
                border: 1px solid #dee2e6;
                letter-spacing: -0.3px;
                border-radius: 4px;
                background-color: #fff;
            }
        }

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

type Props = {
    goSignup: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    setUserId: Dispatch<SetStateAction<string | null>>;
};

export default function LoginForm({ goSignup, setUserId, setToken, setSession }: Props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onChangeEmail = useCallback((e) => {
        setEmail(e.target.value);
    }, []);
    const onChangePassword = useCallback((e) => {
        setPassword(e.target.value);
    }, []);

    const authenticate = useCallback((email, Password) => {
        const cognitoUser = new CognitoUser({
            Username: email,
            Pool: userPool,
        });
        const authDetails = new AuthenticationDetails({ Username: email, Password });
        cognitoUser.authenticateUser(authDetails, {
            onSuccess: function (result: any) {
				const IdToken = result.idToken.jwtToken;
				const AccessToken = result.accessToken.jwtToken;
				const RefreshToken = result.refreshToken.token;
				console.log('authenticateUser.result:', result);

                setUserId(result.idToken.payload.email);
				// setToken(result.refreshToken.token);
                setToken(result.accessToken.jwtToken);
				// const session = new CognitoUserSession({
				//         IdToken,
				//         AccessToken,
				//         RefreshToken
				//         });
				// cognitoUser.signInUserSession = session;
				cognitoUser.setSignInUserSession(result) // This one raise the Exception: TypeError: Cannot read property 'getToken' of undefined
				setSession(result);
				console.log('session:', result);
            },
            onFailure: function (err) {
                console.log(err);
                console.log(err.message);
                if (err.message == 'User is not confirmed.') {
                    alert('가입한 이메일을 인증해주세요.');
                } else if (err.message == 'Incorrect username or password.') {
                    alert('이메일 또는 비밀번호가 틀렸습니다.');
                } else if (err.message == 'User does not exist.') {
                    alert('존재하지 않는 사용자입니다.');
                } else if (err.message.indexOf('USER_SRP_AUTH is not enabled for the client') >= 0) {
					alert('등록되지 않은 사용자 입니다.');
					// eslint-disable-next-line
					goSignup(0);
				}
            },
        });
    }, []);

    const onSubmit = useCallback(
        (e) => {
            e.preventDefault();
            authenticate(email, password);
        },
        [email, password]
    );

    return (
        <LoginFormContainer>
            <h1>LOGIN</h1>
            <form className="loginFormBox" onSubmit={onSubmit}>
                <div className="inputContainer">
                    <input value={email} onChange={onChangeEmail} placeholder="이메일" type="email" required />
                </div>
                <div className="inputContainer">
                    <input value={password} onChange={onChangePassword} placeholder="비밀번호" type="password" required />
                </div>
                <button>로그인</button>
                <button onClick={goSignup}>회원가입</button>
            </form>
        </LoginFormContainer>
    );
}
