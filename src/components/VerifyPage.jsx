import React, {  useState } from 'react';
import '../VerificationCodeForm.css';
import { useNavigate } from 'react-router-dom';

const VerificationCodeForm = () => {
    const [code, setCode] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate()
    const handleInputChange = (e) => {
        setCode(e.target.value);
    };
   
    const handleVerify = async () => {
        if (code.length === 6) {
            // Replace this logic with an actual backend API call
            const email = JSON.parse(localStorage.getItem('email'))
            const name = JSON.parse(localStorage.getItem('name'))
            const password = JSON.parse(localStorage.getItem('password'))
            let phone
            if (localStorage.getItem('phone')) {
                phone = JSON.parse(localStorage.getItem('phone'))
            }
            const result = await fetch('http://localhost:3200/user/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, password, phone, verification_code: code }) })
            if (result.status !== 201) {
                // localStorage.clear()
                const result1 = await result.json()
                setError(result1.message);
                setIsVerified(false)

            }
            else {
                setIsVerified(true);
                localStorage.clear()
                setError('');
                navigate('/')
            }
        } else {
            setError('Please enter a valid 6-digit verification code.');
        }
    };

    return (
        <div className="verification-container">
            <div className="verification-card">
                <h2 className="verification-title">Verify Your Email</h2>
                <p className="verification-description">
                    A verification code has been sent to your email address. Please enter it below.
                </p>

                <div className="verification-input-group">
                    <input
                        type="text"
                        value={code}
                        onChange={handleInputChange}
                        placeholder="Enter Code"
                        maxLength="6"
                        className="verification-input"
                    />
                </div>

                {error && <p className="error-message">{error}</p>}

                <button className="verify-btn" onClick={handleVerify}>
                    Verify Code
                </button>

                {isVerified && <p className="success-message">Your email has been successfully verified!</p>}
            </div>
        </div>
    );
};

export default VerificationCodeForm;
