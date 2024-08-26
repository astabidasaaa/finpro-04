import React from 'react';

type Props = {};

const NonReusableComponent = (props: Props) => {
  return <div className="bg-green-200">NonReusableComponent</div>;
};

export default NonReusableComponent;
