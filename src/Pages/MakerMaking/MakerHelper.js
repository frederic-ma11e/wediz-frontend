import React from "react";
import styled from "styled-components";

const MakerHelper = ({ children }) => {
  return <ChangeDesc>{children}</ChangeDesc>;
};

const ChangeDesc = styled.div`
  line-height: 18px;
  font-size: 13px;
  font-weight: 400;
  display: block;
  margin-top: -40px;
  margin-bottom: 40px;
  color: ${props => props.color || "#90949c"};
`;

export default MakerHelper;
