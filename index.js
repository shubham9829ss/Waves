const app = require("./app");
const cluster = require("node:cluster");
const { connectDB} = require("./config/database")


const os = require("os");
const totalCPU = os.cpus().length;
if(cluster.isPrimary)
{
    for(let i=0;i<totalCPU ; i++)
    {
        cluster.fork();
    }
}else {
    
    connectDB();
    app.listen(process.env.PORT , ()=>{
        console.log(`server is running on port : ${process.env.PORT}`);
    })
}
