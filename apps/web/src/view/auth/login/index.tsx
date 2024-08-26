import React from 'react';
import NonReusableComponent from './NonReusableComponent';

type Props = {};

const LoginPageView = (props: Props) => {
  return (
    <div>
      LoginPageView
      <NonReusableComponent />
    </div>
  );
};

export default LoginPageView;
