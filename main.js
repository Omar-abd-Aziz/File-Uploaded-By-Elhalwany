import { firebaseConfig } from "./firebase.js";

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js';
import { getFirestore, collection, query, where, getDocs,getDoc, setDoc, addDoc, doc,deleteDoc,onSnapshot,orderBy, limit,startAt,endAt } from 'https://www.gstatic.com/firebasejs/9.8.2/firebase-firestore.js';

firebase.initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const storage = firebase.storage();








/* 01 start get AllAccounts with id */

async function getUserDataWithId(id){
  let userData;
  await getDoc(doc(db, "accounts", `${id}`)).then(e=>{
    userData=e.data();
  });
  return userData;
}

/* 01 end get All Accounts with id */



/* 02 start check and get user doc */

let mainPersonData;
let docId = await localStorage.getItem("file-upload-person-id");

if(docId!==null&&docId.trim()!==''){

    mainPersonData=await getUserDataWithId(docId);
    document.querySelector(".PersonName").textContent=`${mainPersonData.username}..`;
    
} else {
  location.href="./login/login.html"
}

/* 02 end check and get user doc */






















/*  start function to upload files */

async function uploadFiles(input) {

  let AllInputFilesSize=0;

  [...input.files].forEach(element => {
    AllInputFilesSize+=element.size;
  });

  function bytesToMegaBytes(bytes) {
    return bytes / (1024 * 1024);
  }  
  let bytes = AllInputFilesSize;
  AllInputFilesSize = bytesToMegaBytes(bytes);
  console.log(AllInputFilesSize);
  if(AllInputFilesSize>50){
    Swal.fire('عذرا حجم الملفات اكبر من 50 ميجا','','error',)
  } else{

    Swal.fire({
      title: 'Please Wait!',
      didOpen: () => {Swal.showLoading()}
    });

    let ArrayOfFilesLinks = [];
     
    if(ArrayOfFilesLinks==undefined){
      ArrayOfFilesLinks=[];
    };
     
    if(input.files[0]!==undefined){
     
      for(let i=0; i<input.files.length; i++){
     
        const ref = firebase.storage().ref();
        const file =  input.files[i];
        const name = +new Date() + "-" + file.name;
        const metadata = {
          contentType: file.type,
        };
           
        const task = ref.child(name).put(file, metadata);
        await task
          .then(async snapshot => snapshot.ref.getDownloadURL())
          .then(async url => {
            ArrayOfFilesLinks.push({src: url,name: file.name});
          })
          .catch(console.error);
      }; 
    };
    return ArrayOfFilesLinks;
  };

  
};
  
/* end function to upload Files */






/* on window open */
// let ArrayOfFilesLinksOld = JSON.parse(localStorage.getItem("ArrayOfFilesLinks") || "[]");

let ArrayOfFilesLinksOld = mainPersonData.ArrayOfFilesLinks || [];


ArrayOfFilesLinksOld.forEach(e=>{
    document.querySelector(".dadOfFilesLinks").innerHTML+=`
    <tr style="font-weight: 600;">

      <td>
        <a>
          <i title="نسخ لينك الملف" class="fa-sharp fa-solid fa-copy Copy-File-Link" data-link="${e.src}" style="font-size: 25px; color: darkred; background: white; border-radius: 50%; padding: 5px 5px; cursor: pointer;"></i>
        </a>
      </td>
      <td style="max-width: 200px; overflow-x: scroll;">
        <a style="font-size: 25px;" href="${e.src}" target="_blank" style="display: inline-block; max-width: 80%; overflow: hidden; text-overflow: ellipsis;">${e.name}</a>
      </td>
      <td>
        <a>
          <i title="حذف الملف" class="fa-sharp fa-solid fa-trash Delet-File" data-link="${e.src}" data-id="${mainPersonData.id}" style="font-size: 25px; color: darkred; background: white; border-radius: 50%; padding: 5px 5px; cursor: pointer;"></i>
        </a>
      </td>

    </tr>
    `;
});










let mainInput = document.querySelector("#mainInput");

document.querySelector(".uploadBtn").addEventListener("click",async ()=>{

    if(mainInput.files[0]==undefined){

        Swal.fire('برجاء اختيار الملفات اولا','','error',)

    } else {
        
        // let ArrayOfFilesLinksOld = JSON.parse(localStorage.getItem("ArrayOfFilesLinks") || "[]");
        await uploadFiles(mainInput).then(ArrayOfFilesLinks=>{

            ArrayOfFilesLinks=[...ArrayOfFilesLinks, ...mainPersonData.ArrayOfFilesLinks || []];

            setDoc(doc(db,"accounts",`${mainPersonData.id}`),{
              ...mainPersonData,
              ArrayOfFilesLinks: ArrayOfFilesLinks,
            }).then(e=>{
              mainPersonData.ArrayOfFilesLinks=ArrayOfFilesLinks;
              Swal.fire('تم الرفع','','success');
            });


            document.querySelector(".dadOfFilesLinks").innerHTML="";
            ArrayOfFilesLinks.forEach(e=>{
              document.querySelector(".dadOfFilesLinks").innerHTML+=`
              <tr style="font-weight: 600;">
          
                <td>
                  <a>
                    <i title="نسخ لينك الملف" class="fa-sharp fa-solid fa-copy Copy-File-Link" data-link="${e.src}" style="font-size: 25px; color: darkred; background: white; border-radius: 50%; padding: 5px 5px; cursor: pointer;"></i>
                  </a>
                </td>
                <td style="max-width: 200px; overflow-x: scroll;">
                  <a style="font-size: 25px;" href="${e.src}" target="_blank" style="display: inline-block; max-width: 80%; overflow: hidden; text-overflow: ellipsis;">${e.name}</a>
                </td>
                <td>
                  <a>
                    <i title="حذف الملف" class="fa-sharp fa-solid fa-trash Delet-File" data-link="${e.src}" data-id="${mainPersonData.id}" style="font-size: 25px; color: darkred; background: white; border-radius: 50%; padding: 5px 5px; cursor: pointer;"></i>
                  </a>
                </td>
          
              </tr>
              `;
            });


        });
        
    };

});




  




document.querySelector(".signOut").addEventListener("click",()=>{

  localStorage.setItem("file-upload-person-id","");
  location.href="./login/login.html"

});



///function to copy text

  function copy(text) {

    console.log("copy done")
    
    let x = document.createElement('textarea')
    x.value=text;
    document.body.appendChild(x)
    x.select()
    x.setSelectionRange(0,99999);
    document.execCommand("copy");
    document.body.removeChild(x)
  }
  
  
//end of copy text


window.onclick=(e)=>{

  if([...e.target.classList].includes("Copy-File-Link"))
  {
    copy(e.target.dataset.link);
    Swal.fire("تم نسخ لينك الملف","","success")
  }



  if([...e.target.classList].includes("Delet-File"))
  {
    Swal.fire({
      title: 'هل تريد حذف الملف؟',
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {

          Swal.fire({
            title: 'Please Wait!',
            didOpen: () => {Swal.showLoading()}
          });
    
          mainPersonData.ArrayOfFilesLinks = mainPersonData.ArrayOfFilesLinks.filter(obj => obj.src !== e.target.dataset.link);

          console.log(e.target.dataset.link);
          console.log(mainPersonData.ArrayOfFilesLinks);


          let firebaseStorageUrl = e.target.dataset.link
          let startIndex = firebaseStorageUrl.indexOf('o/') + 2;
          let endIndex = firebaseStorageUrl.indexOf('?alt=media');
          let filePathAndName = firebaseStorageUrl.substring(startIndex, endIndex);
          let fileName = decodeURIComponent(filePathAndName);


          let imageRef = storage.ref().child(fileName);
          // Delete the file
          imageRef.delete().then(function() {
            console.log("done")
          }).catch(function(error) {
            console.log("error")
          });
          

          setDoc(doc(db,"accounts",`${mainPersonData.id}`),{
            ...mainPersonData,
            ArrayOfFilesLinks: mainPersonData.ArrayOfFilesLinks,
          }).then(el=>{
            e.target.parentNode.parentNode.parentNode.remove();
            Swal.fire('تم حذف الملف','','success');
          });

          
    
        };
      });

  };

};