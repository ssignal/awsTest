import type { NextPage } from 'next';
import { useCallback, useEffect, useState } from 'react';
import LoginForm from '../components/LoginForm';
import styled from 'styled-components';
import SignupForm from '../components/SignupForm';
import userPool from '../src/userPool';
import { CognitoUser } from 'amazon-cognito-identity-js';

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
        if (currentUser) {
            const { user_id } = currentUser.storage;
            setUserId(user_id);
        }
    }, []);
    const logOut = useCallback(() => {
        const currentUser = userPool.getCurrentUser();
        currentUser?.signOut(() => {
            setUserId(null);
        });
    }, []);

    return (
        <Container>
            {userId ? (
                <div className="context">
                    <h3>
                        {userId},<br />
                        로그인 완료
                    </h3>
                    <button onClick={logOut}>로그아웃</button>
                </div>
            ) : (
                <>{signupCheck ? <LoginForm goSignup={turnOver} setUserId={setUserId} /> : <SignupForm goLogin={turnOver} />}</>
            )}
        </Container>
    );
};

export default Index;
