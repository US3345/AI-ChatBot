let prompt = document.querySelector("#prompt");
let chatcontainer = document.querySelector(".chat-container");
let imgbtn = document.querySelector("#image");
let imageinput= document.querySelector("#image input");
let submitbtn = document.querySelector("#submit");


const api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCn4EcJLI7rnYZVhlh53pMZFDyR2QGvFA0";

let user = {
    message: null,
    file:{
        mime_type:null,
        data:null,
    }
}

async function generateResponse(aichatbox) {


    let requestOptions = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [
                {
                    parts: [
                        {
                            text: user.message},(user.file.data?[{"inline_data":user.file}]:[])
                    ]
                }
            ]
        })
    };

    try {
        let response = await fetch(api_url, requestOptions);
        let data = await response.json();
     let apiresponse= data?.candidates?.[0]?.content?.parts?.[0]?.text?.replace(/\*\*(.*?)\*\*/g, "$1").trim() || "No response";
     
  aichatbox.querySelector(".ai-chat-area").textContent = apiresponse;   


      
    } catch (error) {
        console.log(error);
        aichatbox.querySelector(".ai-chat-area").textContent = "Error: " + error.message;
    }
    finally{
         chatcontainer.scrollTo({top:chatcontainer.scrollHeight,behavior:"smooth"})
    }
}
 
function createChatbox(html, classes) {
    let div = document.createElement("div");
    div.innerHTML = html;
    div.classList.add(classes);
    return div;
}

function handlechatresponse(userMessage) {
    user.message= userMessage;
    let html = `<img src="user.png" id="userImage" width="8%">
                <div class="user-chat-area">${user.message}
                ${user.file.data ? 
  `<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg" />` 
  : ""
}
</div>`;

    let userchatbox = createChatbox(html, "user-chat-box");
    chatcontainer.append(userchatbox);
    chatcontainer.scrollTo({top:chatcontainer.scrollHeight,behavior:"smooth"})

    setTimeout(() => {
        let html = `<img src="ai.png" id="aiImage" width="10%">
                    <div class="ai-chat-area">
                        <img src="loading.webp" alt="" class="load" width="50px">
                    </div>`;
        let aichatbox = createChatbox(html, "ai-chat-box");
        chatcontainer.append(aichatbox);
        generateResponse(aichatbox);
    }, 600);
}

prompt.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        handlechatresponse(prompt.value);
        prompt.value = "";
    }
});

submitbtn.addEventListener("click",()=>{
    handlechatresponse(prompt.value);
        prompt.value = "";
})
imageinput.addEventListener("change", () => {
  const file = imageinput.files[0];
  if (!file) return;

  let reader = new FileReader();

  reader.onload = (e) => {
    let base64string = e.target.result.split(",")[1];

    user.file = {
      mime_type: file.type,
      data: base64string
    };
  };

  reader.readAsDataURL(file);
});

imgbtn.addEventListener("click",()=>{
    imgbtn.querySelector("input").click();
})