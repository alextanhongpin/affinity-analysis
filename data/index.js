const strings = `golang string,100
json golang,60
golang for,60
golang file,60
golang http,55
map golang,55
golang array,50
golang struct,50
golang example,45
slice golang,40
time golang,40
golang type,35
golang api,35
golang server,35
golang interface,30
golang github,30
golang test,30
golang install,30
golang package,25
python,25
golang error,25
docker golang,25
golang channel,20
golang tutorial,20
golang set,20
RISING
golang 1.9,"+2,200%"
golang 1.8.1,"+1,150%"
golang dep,"+1,150%"
golang zap,+400%
golang chi,+200%
golang 1.8,+200%
golang graphql,+130%
kubernetes,+110%
cobra golang,+100%
vscode,+100%
jetbrains golang,+100%
vscode golang,+80%
udemy,+70%
golang custom error,+70%
golang grpc,+70%
aws lambda golang,+70%
golang float to string,+60%
golang global variables,+60%
golang context,+50%
golang map reduce,+50%
golang microservices,+50%
golang firebase,+50%
glide golang,+40%
golang select channel,+40%
golang html parser,+40%`

const output = strings.split('\n').map((item) => item.split(',')[0].split(' '))

console.log(JSON.stringify(output))
