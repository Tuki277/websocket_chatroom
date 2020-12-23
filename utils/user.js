const users = []

//Khi co nguoi tham gia vao chat
function userJoin (id, username, room) {
    const user = { id, username, room }
    console.log('user join ============ ', user)

    users.push(user)

    return user
}

function userLeave (id) {
    console.log('userLeave id ========== ', id)

    const index = users.findIndex(user => user.id === id)

    console.log('userLeave index ======== ', index)

    if (index != -1){
        return users.splice(index, 1)[0]
    }
}

function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}

function getCurrentUser(id) {
    return users.find(user => user.id === id)
}

module.exports = {
    userJoin,
    userLeave,
    getRoomUsers,
    getCurrentUser
}