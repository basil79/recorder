const USER_AGENT = window.navigator && window.navigator.userAgent || '';

export const IS_ANDROID = (/Android/i).test(USER_AGENT);

export const IS_EDGE = (/Edg/i).test(USER_AGENT);

export const IS_CHROME = !IS_EDGE && ((/Chrome/i).test(USER_AGENT) || (/CriOS/i).test(USER_AGENT));

export const IS_SAFARI = (/Safari/i).test(USER_AGENT) && !IS_CHROME && !IS_ANDROID && !IS_EDGE;
