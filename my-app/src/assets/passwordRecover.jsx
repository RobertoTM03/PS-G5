import React from 'react';

export default function passwordRecover() {
    return (
        <section>
            <section>
                <h1>Introduce new password!</h1>
            </section>
            <section>
                <section>
                    <h4>New Password</h4>
                    <input type="password" name="password" placeholder="Password" />
                </section>
                <section>
                    <h4>Confirm Your New Password</h4>
                    <input type="password" name="password" placeholder="Password" />
                </section>
                <section>
                    <button>Change Password</button>
                </section>
                <section>
                    <a>Got to Login</a>
                </section>
            </section>

        </section>
    );
}
