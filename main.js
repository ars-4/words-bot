const read_excel_file = require('read-excel-file/node');


let replies = [];

async function read_excel(_file) {
    const rows = await read_excel_file(_file);
    
    for (let i = 1; i < rows.length; i++) {
        let obj = {};
        obj.commands = [];
        obj.reply = "";
        rows[i][0].split(', ').forEach((element) => {
           obj['commands'].push(element);
           obj['reply'] = rows[i][1];
        });
        replies.push(obj);
    }
    return replies;

}

async function get_reply(words) {
    const replies = await read_excel('commands.xlsx');
    let reply = "Sorry I didn't understand that.";

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
