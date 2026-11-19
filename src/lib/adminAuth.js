export const ADMIN_EMAIL = 'absyalsatria20@gmail.com';

export const isAdminUser = (user) =>
    user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
