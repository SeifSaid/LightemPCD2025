// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract UserRegistry {
    struct User {
        string name;
        int256 latitude;
        int256 longitude;
        bool isProducer;
        uint256 reputation;
    }
    
    mapping(address => User) public users;
    mapping(address => bool) public isRegistered;
    
    event UserRegistered(address indexed user, bool isProducer);
    event LocationUpdated(address indexed user, int256 latitude, int256 longitude);
    event ReputationUpdated(address indexed user, uint256 newReputation);

    function registerUser(
        string calldata name,
        int256 latitude,
        int256 longitude,
        bool asProducer
    ) external {
        require(!isRegistered[msg.sender], "Already registered");
        require(bytes(name).length > 0, "Name cannot be empty");
        
        users[msg.sender] = User({
            name: name,
            latitude: latitude,
            longitude: longitude,
            isProducer: asProducer,
            reputation: 100  // Start with 100 reputation
        });
        
        isRegistered[msg.sender] = true;
        emit UserRegistered(msg.sender, asProducer);
    }

    function updateLocation(int256 latitude, int256 longitude) external {
        require(isRegistered[msg.sender], "User not registered");
        users[msg.sender].latitude = latitude;
        users[msg.sender].longitude = longitude;
        emit LocationUpdated(msg.sender, latitude, longitude);
    }

    function recordTransaction(address user, bool success) external {
        require(isRegistered[user], "User not registered");
        
        User storage userData = users[user];
        if(success) {
            userData.reputation += 1;
        } else {
            userData.reputation = userData.reputation > 1 ? userData.reputation - 1 : 1;
        }
        
        emit ReputationUpdated(user, userData.reputation);
    }

    function getUser(address user) external view returns (
        string memory name,
        int256 latitude,
        int256 longitude,
        bool isProducer,
        uint256 reputation
    ) {
        require(isRegistered[user], "User not registered");
        User storage userData = users[user];
        
        return (
            userData.name,
            userData.latitude,
            userData.longitude,
            userData.isProducer,
            userData.reputation
        );
    }

    function calculateDistance(
        address user1,
        address user2
    ) external view returns (uint256) {
        require(isRegistered[user1] && isRegistered[user2], "Users not registered");
        
        User storage user1Data = users[user1];
        User storage user2Data = users[user2];
        
        // Simple distance
        int256 latDiff = user1Data.latitude - user2Data.latitude;
        int256 longDiff = user1Data.longitude - user2Data.longitude;
        
        uint256 distance = uint256(
            (latDiff * latDiff + longDiff * longDiff)
        );
        
        return distance;
    }
}
