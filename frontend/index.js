import { backend } from "declarations/backend";

let maxUsers = 1000;

async function updateUI() {
    try {
        const currentUsers = await backend.getCurrentUserCount();
        const isAtCapacity = await backend.isAtCapacity();
        
        document.getElementById('currentUsers').textContent = currentUsers.toString();
        document.getElementById('maxUsers').textContent = maxUsers.toString();
        
        // Update progress bar
        const percentage = (currentUsers / maxUsers) * 100;
        const progressBar = document.getElementById('userProgress');
        progressBar.style.width = `${percentage}%`;
        progressBar.setAttribute('aria-valuenow', percentage);
        
        // Update button states
        document.getElementById('addUserBtn').disabled = isAtCapacity;
    } catch (error) {
        console.error('Error updating UI:', error);
    }
}

function showSpinner() {
    document.getElementById('spinner').classList.remove('d-none');
}

function hideSpinner() {
    document.getElementById('spinner').classList.add('d-none');
}

async function addUser() {
    showSpinner();
    try {
        const result = await backend.addUser();
        if (result) {
            console.log('User added successfully');
        } else {
            console.log('Failed to add user - system at capacity');
        }
        await updateUI();
    } catch (error) {
        console.error('Error adding user:', error);
    } finally {
        hideSpinner();
    }
}

async function removeUser() {
    showSpinner();
    try {
        const result = await backend.removeUser();
        if (result) {
            console.log('User removed successfully');
        } else {
            console.log('Failed to remove user - user not found');
        }
        await updateUI();
    } catch (error) {
        console.error('Error removing user:', error);
    } finally {
        hideSpinner();
    }
}

// Event Listeners
document.getElementById('addUserBtn').addEventListener('click', addUser);
document.getElementById('removeUserBtn').addEventListener('click', removeUser);

// Initial UI update
document.addEventListener('DOMContentLoaded', async () => {
    maxUsers = await backend.getMaxUsers();
    await updateUI();
});
