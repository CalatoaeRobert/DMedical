pragma solidity  0.8.4;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";

contract Registration is Ownable, AccessControl{ 
    
  mapping (address => bool) public users;
  uint public userCount;

  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
  bytes32 public constant DOCTOR_ROLE = keccak256("DOCTOR_ROLE");
  bytes32 public constant PATIENT_ROLE = keccak256("PATIENT_ROLE");
  bytes32 public constant RESEARCHER_ROLE = keccak256("RESEARCHER_ROLE");

  constructor() public {
    addUser(0x5c4E9Fccd53c74A4cE7C9fc14AAc38A81F9aE983);
    _setupRole(ADMIN_ROLE, 0x5c4E9Fccd53c74A4cE7C9fc14AAc38A81F9aE983);
  }

  function addUser(address _address) public{
    require(users[_address] == false);
    users[_address] = true;
    userCount++;
  }

  function userExists(address _user) public returns (bool){
    if (users[_user] == true){
      return true;
    }
    else{
      return false;
    }
  }

  function getUserCount() public  returns (uint){
    return userCount;
  }
  
  function addPatient(address _address) public 
  {
    _setupRole(PATIENT_ROLE, _address);
    addUser(_address);
  }

  function addDoctor(address _address) public 
  {
    _setupRole(DOCTOR_ROLE, _address);
    addUser(_address);
  }

  function addAdmin(address _address) public 
  {
    _setupRole(ADMIN_ROLE, _address);
    addUser(_address);
  }

  function addResearcher(address _address) public 
  {
    _setupRole(RESEARCHER_ROLE, _address);
    addUser(_address);
  }

  function getRole(address _address) public view returns (string memory)
  {
    if(hasRole(PATIENT_ROLE, _address))
    {
      return "PATIENT";
    }
    if(hasRole(DOCTOR_ROLE, _address))
    {
      return "DOCTOR";
    }
    if(hasRole(ADMIN_ROLE, _address))
    {
      return "ADMIN";
    }
    if(hasRole(RESEARCHER_ROLE, _address))
    {
      return "RESEARCHER";
    }
  }
}