import { Amplify } from 'aws-amplify';

export const cognitoConfig = {
  userPoolId: import.meta.env.VITE_AWS_COGNITO_USER_POOL_ID || 'us-east-1_iyUxDFyDr',
  userPoolClientId: import.meta.env.VITE_AWS_COGNITO_CLIENT_ID || '2c05cqom47jlqj73gset60llgg',
  region: import.meta.env.VITE_AWS_REGION || 'us-east-1'
};

export function configureAmplify() {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: cognitoConfig.userPoolId,
        userPoolClientId: cognitoConfig.userPoolClientId
      }
    }
  });
}

