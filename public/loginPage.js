'use strict';

const userform = new UserForm();

userform.loginFormCallback = data => {
    ApiConnector.login(data, response => {
        if (response.success) {
            location.reload();
        } else {
            userform.setLoginErrorMessage(response.data)
        }
    })
}

userform.registerFormCallback = data => {
    console.log(data);
    ApiConnector.register(data, response => {
        console.log(response);
        if (response.success) {
            location.reload();
        } else {
            userform.setRegisterErrorMessage(response.data)
        }
    })
}