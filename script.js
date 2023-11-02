const generateForm=document.querySelector(".generate-form");
const imageGallery=document.querySelector(".image-gallery");
const OPENAI_API_KEY="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";
let isImageGenerating=false;

const updateImageCard=(imageArray)=>{
    imageArray.forEach((imageObject,index)=>{
        const imgCard=imageGallery.querySelectorAll(".image-card")[index];
        const imgElement=imgCard.querySelector("img");
        const downloadBtn=imgCard.querySelector(".download-btn");
        const aiGeneratedImg=`data:image/jpeg;base64,${imageObject.b64_json}`;

        imgElement.src=aiGeneratedImg;

        imgElement.onload=()=>{
imgCard.classList.remove("loading");
downloadBtn.setAttribute("href",aiGeneratedImg);
downloadBtn.setAttribute("download",`${new Date().getTime()}.jpg`);
        }
    })
}

const generateAIimage=async(userPrompt,imageQuantity)=>{
    try{
        const response=await fetch("https://api.openai.com/v1/images/generations",{
            method:"POST",
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`},
            body: JSON.stringify({
                prompt: userPrompt,
                n: parseInt(imageQuantity),
                size: "512x512",
                response_format: "b64_json"
            })
        });

        if(!response.ok)throw new Error("Failed to generate images please try again.");

        const { data }= await response.json();
        console.log(data);


    updateImageCard([... data]);        
    }catch(error){
        console.log(error)
    }finally{
        isImageGenerating=false;
    }
}

const handleFormGenrator=(e)=>{
e.preventDefault();
if(isImageGenerating) return;

isImageGenerating=true;

console.log(e.srcElement);

const userPrompt=e.srcElement[0].value;
const imageQuantity=e.srcElement[1].value;

console.log(userPrompt,imageQuantity);

const imageMarkUp=Array.from({length:imageQuantity},()=>
` <div class="image-card loading">
<img src="loading.gif" alt="image1">
<a href="#" class="download-btn">
    <img src="download.png" alt="download">
</a>
</div>`).join("");

imageGallery.innerHTML=imageMarkUp;

generateAIimage(userPrompt,imageQuantity);

}

generateForm.addEventListener("submit",handleFormGenrator);