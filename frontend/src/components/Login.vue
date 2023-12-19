<template>
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
        ></v-text-field>

        <v-text-field
            v-model="password"
            :readonly="loading"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[rules.required, rules.min]"
            :type="show1 ? 'text' : 'password'"
            name="input-10-1"
            label="Normal with hint text"
            hint="At least 8 characters"
            counter
            @click:append="show1 = !show1"
            clearable
        ></v-text-field>
        <v-btn
            :disabled="!form"
            :loading="loading"
            block
            color="success"
            size="large"
            type="submit"
            variant="elevated"
        >
        submit
        </v-btn>
    </v-form>
</template>

<script>
    import axios from "axios";
    import { CognitoJwtVerifier } from "aws-jwt-verify";
    
    import {
        AuthenticationDetails,
        CognitoUserPool,
        CognitoUser,
    } from 'amazon-cognito-identity-js';

    export default {
        
        data: () => ({  
            name: 'Login',
            show1: false,
            password: '',
            loading: false,
            user:"",
            form: false,
            token: null,
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
                    var authenticationDetails = new AuthenticationDetails({
                        Username: 'RecipeBookAdmin',
                        Password: 'EstoEsTemporal@1',
                    });
                    var poolData = {
                        UserPoolId: 'eu-central-1_scuu9XSpL', // Your user pool id here
                        ClientId: '4mqtgj4vshuql0vfb22of6c7n4', // Your client id here
                    };
                    var userPool = new CognitoUserPool(poolData);
                    var userData = {
                        Username: 'RecipeBookAdmin',
                        Pool: userPool,
                    };
                    
                    var cognitoUser = new CognitoUser(userData);
                    var tokenTemp
                    cognitoUser.authenticateUser(authenticationDetails, {
                        onSuccess:  function(result) {
                            this.token = result.getAccessToken().getJwtToken();
                            const verifier = CognitoJwtVerifier.create({
                                userPoolId: "eu-central-1_scuu9XSpL",
                                tokenUse: 'access',
                                clientId: "4mqtgj4vshuql0vfb22of6c7n4",
                                includeRawJwtInErrors: true,
                            });
                            console.log(this.token, "Tocken McToken")
                            try {
                                const payload = verifier.verify(this.token);
                                tokenTemp = this.token
                                console.log("Token is valid. Payload:", payload);
                            } catch (err) {
                                console.log("ERROR", err.message)
                                throw err;
                            }
                            },
                        onFailure: function(err) {
                            alert(err.message || JSON.stringify(err));
                        },
                    });
                } catch (error) {
                    console.log('error signing in', error);
                } finally{
                    console.log("finalmente")
                }
                setTimeout(() => {
                    this.loading = false
                    
                    this.daddy(tokenTemp) 
                }, 2000)
            },
            daddy(token) {
                console.log("paraoDaddy")
                this.$emit('mensaje-al-padre', token);
            }
        } 
    }
</script>