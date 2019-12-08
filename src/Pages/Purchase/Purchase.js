import { API_SH, API_TS } from "Datas/Config.js";
import React, { Component } from "react";
import { color, device } from "Styles/Common.js";

import Address from "./Address";
import Agree from "./Agree";
import BigLoginButton from "Components/BigLoginButton";
import CardInfo from "./CardInfo";
import FinalPrice from "./FinalPrice";
import { FundContext } from "Datas/CompanyData";
import NavBar from "Components/NavBar";
import PaymentContainer from "./PaymentContainer";
import Precaution from "./Precaution";
import ProgressCircle from "Components/ProgressCircle";
import RewardHeader from "Components/RewardHeader";
import UserInfo from "./UserInfo";
import styled from "styled-components";
import { withRouter } from "react-router-dom";

class Purchase extends Component {
  state = {
    data: JSON.parse(localStorage.getItem("data") || "[]"),
    sponsor: Number(window.localStorage.getItem("sponsor")),
    total: 0,
    user: "",
    name: "",
    phoneNumber: "",
    address: "",
    request: "",
    cardFirst: "",
    cardSecond: "",
    cardThird: "",
    cardFourth: "",
    cardTotal: 0,
    verifyPeriod: "",
    cardPassword: "",
    identification: "",
    totalAgree: false,
    firstAgree: false,
    secondAgree: false,
    necessaryCheck: false
  };
  componentDidMount = () => {
    const { data } = this.state;
    fetch(`${API_TS}/account/modifyprofile`);

    let total = 0;
    data.forEach(e => {
      total = total + e.price * e.quantity;
    });

    this.setState({
      total
    });
  };

  handleChange = e => {
    const name = e.target.name;
    this.setState({
      [name]: e.target.value
    });
  };

  handleTotalAgree = () => {
    const { firstAgree, secondAgree } = this.state;
    let agreeArray = ["firstAgree", "secondAgree", "totalAgree"];
    agreeArray.forEach(el => {
      if (firstAgree && secondAgree) {
        this.setState({
          [el]: false
        });
      } else {
        this.setState({
          [el]: true
        });
      }
    });
  };

  handleAgree = e => {
    const name = e.target.name;
    this.setState({
      [name]: !this.state[name]
    });
  };

  handlePost = () => {
    const {
      name,
      phoneNumber,
      address,
      request,
      verifyPeriod,
      cardPassword,
      identification,
      totalAgree,
      necessaryCheck,
      cardTotal,
      cardFirst,
      cardSecond,
      cardThird,
      cardFourth
    } = this.state;
    this.setState({
      cardTotal: Number(cardFirst + cardSecond + cardThird + cardFourth)
    });
    if (
      name &&
      phoneNumber &&
      address &&
      verifyPeriod &&
      cardPassword &&
      identification &&
      totalAgree &&
      necessaryCheck
    ) {
      fetch(`${API_TS}/order`, {
        method: "post",
        headers: { Authorization: window.localStorage.getItem("VALID_TOKEN") },
        body: JSON.stringify({
          delivery_name: name,
          delivery_number: phoneNumber,
          delivery_address: address,
          delivery_request: request,
          card_number: cardTotal,
          card_period: verifyPeriod,
          card_birthday: identification,
          is_agreed: totalAgree,
          is_support_agreed: necessaryCheck,
          reward: 1
        })
      })
        .then(res => res.json())
        .then(res => {
          console.log("결제하기 response ====", res);
        });
      let keyToRemove = ["data", "sponsor"];
      keyToRemove.forEach(key => window.localStorage.removeItem(key));
      this.props.history.push("/");
    } else {
      alert("필수 항목을 입력해주시거나 체크해주시기 바랍니다.");
    }
  };

  render() {
    const {
      data,
      sponsor,
      total,
      user,
      totalAgree,
      firstAgree,
      secondAgree,
      necessaryCheck
    } = this.state;
    return (
      <Main>
        <NavBar />
        <RewardHeader data={FundContext} />
        <ProgressCircle
          secondCircle={color.blue}
          secondBorder="none"
          secondColor="white"
        />
        <Container>
          <PaymentContainer data={data} sponsor={sponsor} />
          <FinalPrice data={data} sponsor={sponsor} total={total} />
        </Container>
        <Container display="flex">
          <UserInfo
            data={user}
            necessaryCheck={necessaryCheck}
            handleAgree={this.handleAgree}
          />
          <Address data={user} handleChange={this.handleChange} />
        </Container>
        <Container display="flex" position="relative">
          <CardInfo handleChange={this.handleChange} />
          <Precaution />
        </Container>
        <Container>
          <Agree
            handleTotalAgree={this.handleTotalAgree}
            handleAgree={this.handleAgree}
            totalAgree={totalAgree}
            firstAgree={firstAgree}
            secondAgree={secondAgree}
          />
        </Container>
        <Container align="center">
          <BigLoginButton width="150px" radius="3px" onClick={this.handlePost}>
            결제 예약하기
          </BigLoginButton>
        </Container>
      </Main>
    );
  }
}

export default withRouter(Purchase);

const Main = styled.main`
  width: 100%;
  min-width: 400px;
  top: 0;
  position: ${props => props.position || ""}
  background-color: ${props => props.background || ""};
`;

const Container = styled.div`
  width: 650px;
  margin: 0 auto 40px;
  position: ${props => props.position || ""};
  display: ${props => props.display || ""};
  text-align: ${props => props.align || ""};
  @media ${device.middle} {
    display: block;
    width: 100%;
    padding: 0 20px;
  }
`;
