import connectDB from "./db.js";
import app from "./app.js";


app.get('/', (req, res)=>{
    res.send('Hello from server ! Api is working fine')
})


const PORT = process.env.PORT || 8000;


connectDB()
.then(() => {
    app.listen( PORT , () => {
        console.log(`Server is running on port ${PORT}`);
    }); 
})
.catch((error) => {
    console.error("Failed to connect to the database", error);
});


export default app;
