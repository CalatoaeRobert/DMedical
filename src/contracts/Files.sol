pragma solidity  0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import "./Patients.sol";

contract Files is ERC721URIStorage{

    uint public tokenCount;

    Patients _patients;

    address contractAddress;

    constructor(address filesA) ERC721("DHealthcare", "DHC"){
        _patients = Patients(filesA);
        contractAddress = filesA;
    }

    function mint(string memory _tokenURI, address _to) external returns(uint) {
        tokenCount++;
        _safeMint(msg.sender, tokenCount);
        _setTokenURI(tokenCount, _tokenURI);
        _patients.addFileNft(tokenCount, _to);

        return(tokenCount);
    }

    function getTokenCount() external returns(uint) {
        return tokenCount;
    }

    function transferFile(address _to, uint tokenId) external {
        transferFrom(address(this), _to, tokenId);
    }

}