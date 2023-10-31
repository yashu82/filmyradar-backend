const media = require("./media");

async function mediaArray(medArr,type,category) {
    let data=await Promise.all((medArr.results).map(async(item)=>{
        return (await media(item,type,category));
    }))    
return(data);

}
module.exports = mediaArray;

