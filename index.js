const connectToMongo = require("./db");
const express = require('express')
const http = require('http')

const {Server} = require("socket.io");
const cors = require('cors')

const app = express()
const server = http.createServer(app);
const fetchuser = require ('./middleware/fetchUser.js');
const User = require('./models/User.js');
const chat = require('./models/Chat.js');

app.use(cors());
const io = new Server(server,{
    cors: {
        origin:"http://localhost:3000", //Origin of the frontend.
        // origin:"http://192.168.0.3:3000", //Origin of the frontend.
        methods:["GET","POST"],
    },
});

connectToMongo();

const port = 5000;

app.use(express.json());
//Available routes.
app.use('/api/auth',require('./routes/auth.js'));

const users = [];//Stores mapping between user id and name
const socket_id_user_id = [];//Stores the mapping between socket id to corresponding user id.

io.on( "connection" , async ( socket ) =>  {
    // console.log(`A client_socket connected : ${socket}` );
    console.log(`a user connected : ${socket.id}` );
    socket.on('new_user_joined',async(data)=>{
        console.log("User token : ",data.token);
        const user = await fetchuser(data.token);
        console.log("User : ",user);
        if(user.name){
            console.log("broadcast user's name : ",user.name);
            users.push(user);
            socket_id_user_id[socket.id] = user._id;
            io.emit('user_connected',users);

            console.log("chat ids from db in new connection : ",user.chat_ids);

            if(user.chat_ids.length){
                socket.emit('initial_chat',user.chat_ids)
            }
            
            if(user.group_chat_ids.length){
                socket.emit('initial_group_chat',user.group_chat_ids)
            }
        }
    })

    socket.on('send_message',async(data)=>{
        console.log("Data want to send : ",data);
        // const chat_details = await chat.findOne({_id:data.chat_id})
        const {chat_id,msg,user_id} = data;
        const time = new Date().toLocaleTimeString(); 
        const date = new Date().toLocaleDateString(); 
        const update_msg =await chat.updateOne({ _id:chat_id },{$push:{messages:{message:msg,user_id:user_id,time_stamp:time,date:date}}});

        console.log("Update message : ",update_msg);
        io.to(chat_id).emit('received_message',{message:msg,user_id:user_id,time_stamp:time,date:date});
    })

    socket.on('broadcast',(message)=>{
        console.log("broadcast message : ",message);
        if(message.length)
            socket.broadcast.emit('broadcast_message',message);
    })

    //Used for creating group 
    socket.on('create_group',async (data)=>{
        console.log("create_group : ",data);
        if(!data.chat_id){
            console.log("into if of create group");
            const res = await chat.create({
                messages:[]
            })
            console.log("Response after creating chat obj : ",res);
            const chatId = res._id;

            socket.join(chatId);
            const user_ids = data.user_id;

            if(user_ids.length > 2){
                user_ids.forEach(async(user)=>{
                    console.log("Into  foreach loop user id ",user);
                    const update_u1 = await User.updateOne({ _id:user },{ $push:{group_chat_ids:res._id} });
                    console.log("Updated user after creating group : ",update_u1);
                })
                socket.emit('after_group_chat',chatId);
            }else{
                user_ids.forEach(async(user)=>{
                    console.log("Into  foreach loop user id ",user);
                    const update_u1 = await User.updateOne({ _id:user },{ $push:{chat_ids:res._id} });
                    console.log("Updated user after creating group : ",update_u1);
                })
                socket.emit('after_chat',chatId);
            }
            io.to(res._id).emit('created_group',{chat_id:res._id});
            console.log('chat id after creation of new chat : ' ,res._id);
        }
        else{
            console.log("into else of create group");
            // console.log("data on create group : ",data);
            const chatId = data.chat_id;
            console.log("chat id : ",chatId);
            let last_messages = await chat.findById(chatId);
            if(last_messages !==  null && last_messages.messages.length>0) {
                last_messages = last_messages.messages.slice(-10); 
                socket.emit('initial_message',last_messages);
                // console.log("last messages : ",last_messages.messages);
            }
            // socket.emit('initial_message',last_messages.messages);

            socket.join(chatId);
        }
    })

    socket.on("disconnect",async(message)=>{
        console.log( `user disconnected : ${socket.id} with message : ${message}` );
    })
})

server.listen(port,()=>{
    console.log(`iNotebook backend is listening to http://localhost:${port}`);
})