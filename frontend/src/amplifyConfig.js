import Amplify from 'aws-amplify';

const amplifyConfig = {
    Auth: {
        region: 'eu-central-1',
        userPoolId: 'eu-central-1_oi48gpngh',
        userPoolWebClientId: '5ln2ofjtto6roloog2fbm3gmqa',
    },
};



console.log(Amplify.configure(amplifyConfig));