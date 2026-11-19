import assert from 'node:assert/strict';
import test from 'node:test';
import { isAdminUser } from './adminAuth.js';

test('accepts configured admin email case-insensitively', () => {
    assert.equal(isAdminUser({ email: 'ABSYALSATRIA20@GMAIL.COM' }), true);
});

test('rejects other users and missing email', () => {
    assert.equal(isAdminUser({ email: 'someone@example.com' }), false);
    assert.equal(isAdminUser(null), false);
});
