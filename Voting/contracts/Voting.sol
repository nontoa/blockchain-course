
contract Voting {

    uint256 public timeStart;
    uint256 public timeEnd;

    event Successful(address sender);
    event Failed(address sender);

    mapping(address => bool) public userList;
    mapping(string => uint) public teams;

    uint numVotes = 0;    

    constructor(uint256 tieme_Start, uint256 time_End){
        teams["barcelona"] = 0;
        teams["real"] = 0;
        teams["psg"] = 0;
        teams["liverpool"] = 0;
        teams["bayern"] = 0;
        timeStart = tieme_Start;
        timeEnd = time_End;
    }

    function alreadyVote(address user) public view returns (bool){

        return userList[user];
    }

    function vote(string calldata selectedTeam) public payable {
        
        require(block.timestamp >= timeStart && block.timestamp <= timeEnd, "Voting is not currently open");
        if(alreadyVote(msg.sender)){
            emit Failed(msg.sender);
        } else {
            numVotes += 1;
            userList[msg.sender] = true;
            teams[selectedTeam] += 1;
            emit Successful(msg.sender);
        }
        
    }

    function getNumVotes() public view returns (uint) {
        
        return numVotes;
    }

    function getWinner() public view returns (string memory) {

        uint votes = teams["barcelona"];
        string memory winner = "barcelona";

        if (teams["real"] > votes){
            votes = teams["real"];
            winner = "real";
        }
        if (teams["psg"] > votes){
            votes = teams["psg"];
            winner = "psg";
        }
        if (teams["liverpool"] > votes){
            votes = teams["liverpool"];
            winner = "liverpool";
        }
        if (teams["bayern"] > votes){
            votes = teams["bayern"];
            winner = "bayern";
        }

        return winner;
    }

}