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
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[rules.required, rules.min]"
            :type="show ? 'text' : 'password'"
            name="input-10-1"
            label="Normal with hint text"
            hint="At least 8 characters"
            counter
            @click:append="show = !show"
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
                    this.congitouser = cognitoUser
                    cognitoUser.authenticateUser(authenticationDetails, {
                        onSuccess:  function(result) {
                            tokenTemp = result.getAccessToken().getJwtToken();
                            console.log("CANNNNON", tokenTemp)
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
                this.$emit('emit-token', token);
            },
            signOut() {
                console.log("fuera")
                cognitoUser.signOut();
                this.token=""
                this.$emit('emit-token', "");
            }
        } 
    }
</script>