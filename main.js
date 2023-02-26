const read_excel_file = require('read-excel-file/node');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
let replies = [];
const port = 8000;

app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(express.json());
app.use(cors());


app.get("/", (req, res) => {
    res.send(`
    <h1>Welcome</h1>
    <form method="post" action="/replyme">
    <input type="text" name="sentence">
    <button>Send</button>
    </form>
    `);
    res.end();
})
app.post("/replyme", async (req, res) => {
    let sentence = req.body['sentence'];
    let reply = await get_reply(sentence);
    res.send({
        "error":"false",
        "data":reply
    });
    res.end();
});

app.listen(port, () => {
    console.log(`Listening at port ${port}`)
})

async function read_excel(_file) {
    const rows = await read_excel_file(_file);
    
    for (let i = 1; i < rows.length; i++) {
        let obj = {};
        obj.commands = [];
        obj.reply = "";
        rows[i][0].split(', ').forEach((element) => {
           obj['commands'].push(element.toLowerCase());
           obj['reply'] = rows[i][1];
        });
        replies.push(obj);
    }
    return replies;

}

async function get_reply(words) {
    const replies = await read_excel('commands.xlsx');
    let reply = "Sorry I didn't understand that.";
    words = words.toLowerCase();
    for (let i = 0; i < replies.length; i++) {
        if( words.includes(replies[i].commands[0]) ) {
            for(let j = 0; j < replies[i].commands.length; j++) {
                if(words.includes(replies[i].commands[j])) {
                    reply = replies[i].reply;
                }
                else {
                    reply = "Sorry I didn't understand that.";
                }
            }
        }
        else {
            reply = reply;
        }
    }
    return reply;
}
