
class Auth {
    login(username: string, password: string) {
        console.log(`${username}, ${password}`);

        localStorage.setItem('logged', username);
    }

    isLogged() {
        // console.log(localStorage.getItem('logged'));
        return localStorage.getItem('logged');
    }

    logout() {
        localStorage.removeItem('logged');
    }
}

export const auth = new Auth();