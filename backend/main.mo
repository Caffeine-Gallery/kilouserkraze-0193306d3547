import Bool "mo:base/Bool";

import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import HashMap "mo:base/HashMap";
import Hash "mo:base/Hash";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Time "mo:base/Time";

actor {
    // Stable storage for user data across upgrades
    private stable var userEntries : [(Principal, Time.Time)] = [];
    private let MAX_CONCURRENT_USERS : Nat = 1000;
    
    // HashMap to store active users and their last activity timestamp
    private var activeUsers = HashMap.HashMap<Principal, Time.Time>(
        1000, 
        Principal.equal, 
        Principal.hash
    );

    // Initialize from stable storage after upgrade
    system func postupgrade() {
        for ((principal, timestamp) in userEntries.vals()) {
            activeUsers.put(principal, timestamp);
        };
    };

    // Save to stable storage before upgrade
    system func preupgrade() {
        userEntries := Iter.toArray(activeUsers.entries());
    };

    // Add a new user if under capacity
    public shared(msg) func addUser() : async Bool {
        let caller = msg.caller;
        
        if (activeUsers.size() >= MAX_CONCURRENT_USERS) {
            return false;
        };

        activeUsers.put(caller, Time.now());
        return true;
    };

    // Remove a user
    public shared(msg) func removeUser() : async Bool {
        let caller = msg.caller;
        
        switch (activeUsers.remove(caller)) {
            case null { false };
            case (?_) { true };
        };
    };

    // Get current number of active users
    public query func getCurrentUserCount() : async Nat {
        activeUsers.size();
    };

    // Get maximum allowed users
    public query func getMaxUsers() : async Nat {
        MAX_CONCURRENT_USERS;
    };

    // Check if system is at capacity
    public query func isAtCapacity() : async Bool {
        activeUsers.size() >= MAX_CONCURRENT_USERS;
    };
}
