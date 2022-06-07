import React, { useCallback, useState, useRef } from 'react';
import styled from 'styled-components';
import userPool from '../src/userPool';

const SignupFormContainer = styled.div`
    h1 {
        text-align: center;
    }
    .singupFormBox {
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

const ErrorMessage = styled.div`
    color: red;
    font-size: 12px;
    float: right;
    line-height: 30px;
    font-weight: 600;
`;

type Props = {
    goLogin: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export default function SignupForm({ goLogin }: Props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const gologinBtn = useRef<HTMLButtonElement>(null);
    const onChangeEmail = useCallback((e) => {
        e.preventDefault();
        setEmail(e.target.value);
    }, []);
    const CheckPass = (str: string) => {
        var reg1 = /^[a-z0-9]{8,20}$/; // a-z 0-9 중에 8자리 부터 20자리만 허용
        var reg2 = /[a-z]/g;
        var reg3 = /[0-9]/g;
        return reg1.test(str) && reg2.test(str) && reg3.test(str);
    };
    const onChangePassword = useCallback((e) => {
        setPassword(e.target.value);
        setPasswordError(!CheckPass(e.target.value));
    }, []);
    const onSubmit = useCallback(
        (e) => {
            e.preventDefault();
            userPool.signUp(email, password, [], [], (err, data) => {
                if (err) {
                    return console.error(err);
                }
                alert('가입완료! 이메일 인증 후 로그인 하세요.');
                gologinBtn.current?.click();
            });
        },
        [email, password]
    );

    return (
        <SignupFormContainer>
            <h1>SIGNUP</h1>
            <form className="singupFormBox" onSubmit={onSubmit}>
                <div className="inputContainer">
                    <input placeholder="이메일" type="email" onChange={onChangeEmail} required />
                </div>
                <div className="inputContainer">
                    <input placeholder="비밀번호" type="password" onChange={onChangePassword} minLength={8} required />
                </div>
                {passwordError && <ErrorMessage>8 or more characters, must include numbers and letters</ErrorMessage>}
                <button type="submit">회원가입</button>
                <button ref={gologinBtn} onClick={goLogin}>
                    로그인하러 가기
                </button>
            </form>
        </SignupFormContainer>
    );
}
