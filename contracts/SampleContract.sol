pragma solidity ^0.4.4;

contract SampleContract {

    // This value is visible in etherscan.io explorer
    uint256 public value;

    // Anyone can call this contract and override the value of the previous caller
    function setValue(uint256 value_) public {
        value = value_;
    }

}