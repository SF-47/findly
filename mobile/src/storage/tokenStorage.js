let token = null;

export function saveToken(newToken){
    token = newToken;
}

export function getToken(){
    return token;
}

export function removeToken(){
    token = null;
}