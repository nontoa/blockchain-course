
contract Lottery {
    
    event Win(address sender, uint amount);
    
    event Loose(address sender);

    uint numTickets = 0;

    constructor(){
    }

    function random(uint maxNum, uint minNum) public view returns (uint) {
        return uint(
            keccak256(
                abi.encodePacked(
                    block.prevrandao,
                    block.timestamp
                )
            )
        ) % (maxNum + 1 - minNum) + minNum;
    }

    function isWinning() public view returns (bool) {
    
        return random(1,0) == 0;
    }

    function buyTicket() public payable {
        
        numTickets += 1;
        if (isWinning()){
        
            uint maxPayable = address(this).balance < (2 * msg.value) ? address(this).balance : (2 * msg.value);
            uint prizeCoef = random(10, 1);
            uint prize = maxPayable / prizeCoef;

            payable(msg.sender).transfer(prize);
            emit Win(msg.sender, prize);
        } else {
            emit Loose(msg.sender); 
        }
    }

    function getNumTickets() public view returns (uint) {
        
        return numTickets;
    }

}