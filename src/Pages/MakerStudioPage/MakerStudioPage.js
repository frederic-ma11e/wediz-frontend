import { API_SH, API_TS } from "Datas/Config.js";

import AddRewardModal from "./AddRewardModal";
import BaseInfo from "./BaseInfo";
import DesignReward from "./DesignReward";
import FundingStory from "Components/FundingStory.js";
import HeaderForMakerStudio from "./HeaderForMakerStudio";
import MakerStudioNav from "./MakerStudioNav.js";
import React from "react";
import navCategoryForMakerStudio from "Datas/CategoryForMakerStudio.js";
import styled from "styled-components";
import { withRouter } from "react-router-dom";

class MakerStudioPage extends React.Component {
  state = {
    showRewardAddModal: false,
    reward: [],
    category: navCategoryForMakerStudio.category,
    detect: "funding",
    list: navCategoryForMakerStudio.list1
  };

  handleAddress = data => {
    console.log("handleAddress 작동");
    this.setState({
      address: data
    });
  };

  openModal = () => {
    this.setState({
      showRewardAddModal: true
    });
  };

  closeModal = () => {
    this.setState({
      showRewardAddModal: false
    });
  };

  deleteReward = index => {
    const { reward } = this.state;
    reward.splice(index, 1);
    this.setState({
      reward
    });
  };

  handlePost = () => {
    const { reward } = this.state;
    fetch(`${API_TS}/fund/reward`, {
      method: "post",
      headers: {
        Authorization: window.localStorage.getItem("VALID_TOKEN")
      },
      body: JSON.stringify({
        data: reward
      })
    })
      .then(res => res.json())
      .then(res => console.log(res));
  };

  handleReward = (price, name, introduction, option, stock, scheduled_date) => {
    let newReward = {
      price,
      name,
      introduction,
      option,
      stock,
      scheduled_date
    };
    const { reward } = this.state;
    if (price && name && introduction && option && stock && scheduled_date) {
      this.setState({
        reward: reward.concat(newReward)
      });
      this.closeModal();
    } else {
      alert("모든 항목을 입력해주세요.");
    }
  };

  render() {
    const { showRewardAddModal, reward } = this.state;
    const { id } = this.props.match.params;
    return (
      <>
        <AddRewardModal
          show={showRewardAddModal}
          closeModal={this.closeModal}
          handleReward={this.handleReward}
        />
        <HeaderForMakerStudio />
        <MainArticleContainer>
          <MakerStudioNav
            navCategory={this.state}
            getAddress={this.handleAddress}
          />
          {id === "design" ? (
            <DesignReward
              showModal={showRewardAddModal}
              openModal={this.openModal}
              handlePost={this.handlePost}
              deleteReward={this.deleteReward}
              data={reward}
            />
          ) : id === "baseinfo" ? (
            <BaseInfo />
          ) : id === "story" ? (
            <FundingStory />
          ) : (
            ""
          )}
        </MainArticleContainer>
      </>
    );
  }
}

export default withRouter(MakerStudioPage);
const MainArticleContainer = styled.div`
  width: 80%;
  background-color: white;
  display: flex;
  position: relative;
  top: 55px;
`;
