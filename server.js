// get = read
// post = create
// patch = update
// delete = destroy


const e = require('express');
const express = require('express');
const app = express();
const PORT = 8080;

app.use(express.json());



var rooms = [];

var testRoom = {
    'name':'room_1',
    'secretcode' : 'abcdefg',
    'members': 2,
    'messages' : ['hello','how are you?','fine bro']
};

rooms.push(testRoom);


// list rooms
app.get('/listrooms',(req,res) => {
    res.status(200).send(rooms);
});


// create a room
app.post('/createroom', (req,res) => {
    const { roomname } = req.body; // seems like this variable name has to be the same as the json being sent by client
    const { roommembers } = req.body;
   
    rooms.push({
        'name': roomname,
        'secretcode': 'randomlygenerated',
        'members': 0,
        'messages': []
    });

    res.send({
        message: `room ${roomname} been created`
    });
});



// join a room
app.post('/joinroom', (req,res) => {
    const {roomname} = req.body;
    
    if (doesntExist(roomname)){
        res.send({
            'message': "that room doesn't exist! sorry."
        })
    }


    var room = joinRoom(roomname);
    res.send({
        'message' : "room successfully joined!",
        'roominformation' : room
    });

    


}) ;

// leave a room 
app.post('/leaveroom', (req,res) => {
    const {roomname} = req.body;

    if (doesntExist(roomname)){
        res.send({
            'message': "that room doesn't exist! sorry."
        })
    }

    var result = leaveRoom(roomname);
    if (result){
        res.send({
            'message' : "successfully left the room. see ya!"
        });
    } else {
        res.send({
            'message' : "failed to leave room -- something went wrong!"
        });
    }
    

}) ;

// sending message to room
app.post('/sendmessage', (req,res) => {
    const {secretcode} = req.body;
    const {messagetosend} = req.body;
    if (!codeExists(secretcode)){
        res.send({
            'message': 'action failed. that room does not exist!'
        })
    } 

    
    for (var i = 0; i < rooms.length; i++){
        if (secretcode === rooms[i].secretcode) {
            rooms[i].messages.push(messagetosend);
        }
    }
    res.send({
        'message' : 'message successfully sent'
    });

    console.log(rooms);
});

// get messages from a room
app.post('/getmessages', (req,res) => {
    const {secretcode} = req.body;


    if (!codeExists(secretcode)) {
        res.send({
            'message' : "action failed, that room doesn't exist."
        });
    }

    var messages = [];
    for (var i = 0; i < rooms.length; i++){
        if (rooms[i].secretcode === secretcode){
            messages = rooms[i].messages;
        }
    }
    res.send({
        'message': 'successfully got messages',
        'roommessages' : messages
    })
});

// checks to see if room does not exist
function doesntExist(roomname){
    for (var i = 0; i < rooms.length; i++){
        if (roomname === rooms[i].name){
            return false;
        }
    }

    return true;
}

// join room helper function
function joinRoom(roomname){
    for (var i = 0; i < rooms.length; i++){
        if (roomname === rooms[i].name){
            rooms[i].members += 1;
            //give the messages to the user
            return rooms[i];
        }
    }
}

// leave room helper function
function leaveRoom(roomname){
    for (var i = 0; i < rooms.length; i++){
        if (roomname === rooms[i].name){
            rooms[i].members -= 1;
            return true;
        }
    }

    return false;
}


// for message sending purposes
// checks to see if the secret code exists, so that the user can send messages to a room
function codeExists(secretcode){
    for (var i = 0; i < rooms.length; i++){
        if (secretcode === rooms[i].secretcode){
            
            return true;
        }
    }

    return false;
}




app.listen(PORT, () => console.log('server running on 8080'));


