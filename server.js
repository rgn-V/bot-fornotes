import * as http from 'http'

http.CreateServer((req, res) => {
    console.log('work')
    res.end('work')
}).listen(3000)


