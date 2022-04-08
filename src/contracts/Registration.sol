pragma solidity  0.8.0;

contract Registration{ 
    
  mapping (address => bool) public users;

  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
  bytes32 public constant DOCTOR_ROLE = keccak256("DOCTOR_ROLE");
  bytes32 public constant PATIENT_ROLE = keccak256("PATIENT_ROLE");

  constructor() public {
    addUser(0x5c4E9Fccd53c74A4cE7C9fc14AAc38A81F9aE983);
    addUser(0xe2D18E6fffd6B2d36B3C7e2F44E33374c7d92B33);
  }

  function addUser(address _user) public{
    users[_user] = true;
  }

  function userExists(address _user) public returns (bool){
    if (users[_user] == true){
      return true;
    }
    else{
      return false;
    }
  }
}