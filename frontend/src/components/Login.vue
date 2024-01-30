<template>
    <v-sheet class="pa-12" rounded>
        <v-card class="mx-auto px-6 py-8" max-width="" color="primary">
            <v-form
                v-model="form"
                @submit.prevent="onSubmit"
            >
                <v-text-field
                    v-model="user"
                    label="Email address"
                    placeholder="johndoe@gmail.com"
                    type="email"
                    :rules="[rules.required]"
                    :readonly="loading"
                    clearable
                    bg-color="white"
                    class="pb-2"
                ></v-text-field>

                <v-text-field
                    v-model="password"
                    :readonly="loading"
                    :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[rules.required, rules.min]"
                    :type="show ? 'text' : 'password'"
                    name="input-10-1"
                    label="Normal with hint text"
                    hint="At least 8 characters"
                    counter
                    bg-color="white"
                    @click:append="show = !show"
                    clearable
                    class="pb-2"
                ></v-text-field>
                <v-btn
                    :disabled="!form"
                    :loading="loading"
                    block
                    color=""
                    size="large"
                    type="submit"
                    variant="elevated"
                >
                submit
                </v-btn>
            </v-form>
        </v-card>
    </v-sheet>
</template>

<script>
    import {AuthenticationDetails,CognitoUserPool,CognitoUser} from 'amazon-cognito-identity-js';

    export default {
        data: () => ({  
            name: 'Login',
            show: false,
            password: '',
            loading: false,
            user:"",
            form: false,
            token: null,
            congitouser:null,
            rules: {
                required: value => !!value || 'Required.',
                min: v => v.length >= 10 || 'Min 10 characters',
                emailMatch: () => (`The email and password you entered don't match`),
            },
        }),
        methods: {
            onSubmit () {       
                this.loading = true
                try {
                    console.log(process.env)
                    var authenticationDetails = new AuthenticationDetails({
                        Username: this.user,
                        Password: this.password,
                    });
                    var poolData = {
                        UserPoolId: process.env.COGNITO_POOL_ID, // Your user pool id here
                        ClientId: process.env.COGNITO_CLIENT_ID, // Your client id here
                    };
                    var userPool = new CognitoUserPool(poolData);
                    var userData = {
                        Username: this.user,
                        Pool: userPool,
                    };
                    
                    var cognitoUser = new CognitoUser(userData);
                    var tokenTemp
                    this.congitouser = cognitoUser
                    cognitoUser.authenticateUser(authenticationDetails, {
                        onSuccess:  function(result) {
                            tokenTemp = result.getAccessToken().getJwtToken();
                        },
                        onFailure: function(err) {
                            alert(err.message || JSON.stringify(err));
                        },
                    });
                    setTimeout(() => {
                        this.loading = false
                        this.daddy(tokenTemp) 
                    }, 3000)
                } catch (error) {
                    console.log('error signing in', error);
                } 
            },
            daddy(token) {
                this.$emit('emit-token', token, this.congitouser);
            },
        } 
    }
</script>