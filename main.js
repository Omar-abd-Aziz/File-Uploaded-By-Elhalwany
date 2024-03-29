import {docName, initializeApp,firebaseConfig ,getFirestore,getCountFromServer, collection, query, where, getDocs,getDoc, setDoc, addDoc, doc,deleteDoc,onSnapshot,orderBy, limit,startAt,endAt } from './firebase.js';

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
let docId = await localStorage.getItem(`${docName}`);

if(docId!==null&&docId.trim()!==''){

    mainPersonData=await getUserDataWithId(docId);
    document.querySelector(".PersonName").textContent=`${mainPersonData.username}`;
    
} else {
  location.href="./login/login.html"
}

/* 02 end check and get user doc */






















/*  start function to upload files */


async function uploadFiles(input) {
  let AllInputFilesSize = 0;

  [...input.files].forEach(element => {
    AllInputFilesSize += element.size;
  });

  function bytesToMegaBytes(bytes) {
    return bytes / (1024 * 1024);
  }

  let bytes = AllInputFilesSize;
  AllInputFilesSize = bytesToMegaBytes(bytes);
  console.log(AllInputFilesSize);

  if (AllInputFilesSize > 100) {
    Swal.fire('عذرا حجم الملفات اكبر من 100 ميجا', '', 'error',)
  } else {


    let ArrayOfFilesLinks = [];

    if (ArrayOfFilesLinks == undefined) {
      ArrayOfFilesLinks = [];
    };

    if (input.files[0] !== undefined) {

      Swal.fire({
        html: `

        <h1 class="progressStuteTitle" style="font-size: 24px; text-align: center;">

        ${mainInput.files.length>1?`جاري رفع اول ملف من اصل ${mainInput.files.length} ملفات`:"جاري رفع الملف برجاء الانتظار"}
        
        
        
        </h1>

        <div class="progressDiv" style="display: flex; justify-content: center;">
        
        </div>


        <h2 style="text-align: center;">
          Please Wait!
        </h2>
        `,
        showConfirmButton: false,
      });

      for (let i = 0; i < input.files.length; i++) {
        let ref = firebase.storage().ref();
        let file = input.files[i];
        let name = +new Date() + "-" + file.name;
        let metadata = {
          contentType: file.type,
        };

        let fileRef = ref.child(name);

        let uploadTask = fileRef.put(file, metadata);

        await new Promise((resolve, reject) => {

          

          uploadTask.on('state_changed',
            function (snapshot) {
              let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

              document.querySelector(".progressDiv").innerHTML=`
              
              <div class="ldBar label-center" data-value="1" data-fill-background="black" style="height: 60px; width: 300px;"></div>
              
              `;

              let bar = new ldBar(".ldBar", {
                "preset": "stripe",
                "value": progress.toFixed()
              });

            },
            function (error) {
              console.error('Error uploading file:', error);
              reject(error);
            },
            async function () {
              let url = await fileRef.getDownloadURL();
              ArrayOfFilesLinks.push({
                src: url,
                name: name
              });
              setTheData([{src: url,  name: name}]);
              resolve();
            }
          );
        });
      };
    };

    console.log("done");
    return ArrayOfFilesLinks;
  }
}


  
/* end function to upload Files */






/* on window open */
// let ArrayOfFilesLinksOld = JSON.parse(localStorage.getItem("ArrayOfFilesLinks") || "[]");

let ArrayOfFilesLinksOld = mainPersonData.ArrayOfFilesLinks || [];

console.log(ArrayOfFilesLinksOld)



showFiles(ArrayOfFilesLinksOld);




function showFiles(array){
   

  document.querySelector(".numberOfFiles").textContent=`(${array.length})`;

  array.forEach(e=>{
    document.querySelector(".dadOfFilesLinks").innerHTML+=`
        <tr style="font-weight: 600;">
          
          <td>
            <a>
              <button style="background: transparent; border: none;">
                <i title="نسخ لينك الملف" class="fa-sharp fa-solid fa-copy Copy-File-Link" data-link="${e.src}" style="font-size: 25px; color: darkred; background: white; border-radius: 50%; padding: 5px 5px; cursor: pointer;"></i>
              </button>
            </a>
            <a>
              <button style="background: transparent; border: none;">
                <i data-src="${e.src}" data-name="${e.name}" title="تغيير اسم الملف" class="fa-sharp fa-solid fa-edit Edit-File-Name" data-link="${e.src}" style="font-size: 25px; color: darkred; background: white; border-radius: 50%; padding: 5px 5px; cursor: pointer;"></i>
              </button>
            </a>
          </td>
          <td style="max-width: 200px; overflow-x: scroll;">
            <a class="fileName" style="font-size: 25px;" href="${e.src}" target="_blank" style="display: inline-block; max-width: 80%; overflow: hidden; text-overflow: ellipsis;">${e.name}</a>
          </td>
          <td>
            <a>
              <button style="background: transparent; border: none;">
                <i title="حذف الملف" class="fa-sharp fa-solid fa-trash Delet-File" data-link="${e.src}" data-id="${mainPersonData.id}" style="font-size: 25px; color: darkred; background: white; border-radius: 50%; padding: 5px 5px; cursor: pointer;"></i>
              </button>  
            </a>
          </td>
          
        </tr>
    `;
  })


  // document.querySelector("#mainInput").value="";
  // console.log(document.querySelector("#mainInput").files);
};





let mainInput = document.querySelector("#mainInput");
let numberOfFilesSelect = document.querySelector(".numberOfFilesSelect");
let restInput = document.querySelector(".restInput")


mainInput.addEventListener("change",()=>{

  numberOfFilesSelect.textContent=`
  
  تم تحديد 
  ${mainInput.files.length} 
  ملف
  
  `;
  numberOfFilesSelect.style.display="block";
  restInput.style.display="block";
  // console.log(mainInput.files);
})

document.querySelector(".uploadBtn").addEventListener("click",async ()=>{



    if(mainInput.files[0]==undefined){

        Swal.fire('برجاء اختيار الملفات اولا','','error',)

    } else {
        
        // let ArrayOfFilesLinksOld = JSON.parse(localStorage.getItem("ArrayOfFilesLinks") || "[]");
        await uploadFiles(mainInput).then(ArrayOfFilesLinks=>{

          if(ArrayOfFilesLinks==undefined){
            // Swal.fire('عذرا حجم الملفات اكبر من 100 ميجا','','error')
          } else{
            Swal.fire('تم رفع جميع الملفات','','success');  
          }

          
          
       
        });
        
    };

});




let i = 0; 
function setTheData(ArrayOfFilesLinks){
  ArrayOfFilesLinks = [...ArrayOfFilesLinks, ...mainPersonData.ArrayOfFilesLinks || []];

    setDoc(doc(db,"accounts",`${mainPersonData.id}`),{
      ...mainPersonData,
      ArrayOfFilesLinks: ArrayOfFilesLinks,
    }).then(e=>{
      mainPersonData.ArrayOfFilesLinks=ArrayOfFilesLinks;

      i++;
      
      if(i===mainInput.files.length){
        i=0;
        mainInput.value="";
        numberOfFilesSelect.style.display="none";
        restInput.style.display="none";
      } else{

        document.querySelector(".progressStuteTitle").textContent=`تم رفع ${i} ملف من اصل ${mainInput.files.length} ملفات`;

      };
      
      
    });


    document.querySelector(".dadOfFilesLinks").innerHTML="";
    showFiles(ArrayOfFilesLinks);
};







document.querySelector(".signOut").addEventListener("click",()=>{

  localStorage.setItem(`${docName}`,"");
  location.href="./login/login.html"

});



///function to copy text

  function copy(text) {

    // console.log("copy done")
    
    let x = document.createElement('textarea')
    x.value=text;
    document.body.appendChild(x)
    x.select()
    x.setSelectionRange(0,99999);
    document.execCommand("copy");
    document.body.removeChild(x)
  }
  
  
//end of copy text

window.addEventListener("click",(e)=>{

  document.querySelector(".DivForDragFiles").style.display="none";

  if([...e.target.classList].includes("restInput"))
  {
    mainInput.value=[];
    numberOfFilesSelect.style.display="none";
    restInput.style.display="none";
    // Swal.fire("Done","","success")
  }


  if([...e.target.classList].includes("Copy-File-Link"))
  {
    copy(e.target.dataset.link);
    Swal.fire("تم نسخ لينك الملف","","success")
  }


  if([...e.target.classList].includes("Edit-File-Name")){

    let BtnToChangeName=e.target;
    let DivToChangeName=e.target.parentNode.parentNode.parentNode.parentNode.querySelector(".fileName")
    let FileSrc= BtnToChangeName.dataset.src;
    let FileName= BtnToChangeName.dataset.name;



    Swal.fire({
      title: 'Change Name',
      input: 'text',
      inputValue: `${FileName.trim()}`,
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Save',
      showLoaderOnConfirm: true,
      preConfirm: async(newName) => {

        Swal.fire({
          title: 'Please Wait!',
          didOpen: () => {
            Swal.showLoading()
          }
        });

        newName=newName.trim();

        if(newName!==''){

          let fileToEdit=mainPersonData.ArrayOfFilesLinks.find(e=>e.src==FileSrc);
          fileToEdit.name=newName;
          // console.log(mainPersonData.ArrayOfFilesLinks)
          setDoc(doc(db, "accounts", `${mainPersonData.id}`), {
            ...mainPersonData,
            ArrayOfFilesLinks: mainPersonData.ArrayOfFilesLinks,
          }).then(e=>{


            DivToChangeName.textContent=`${newName}`;
            BtnToChangeName.dataset.name=`${newName}`;
            
            Swal.fire(
              'Done',
              '',
              'success'
            );
          })
              
        }else{
          Swal.fire(
            'Error',
            '',
            'error'
          );
        };
          
          
      },
      allowOutsideClick: () => !Swal.isLoading()
    })

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

          // console.log(e.target.dataset.link);
          // console.log(mainPersonData.ArrayOfFilesLinks);


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
            e.target.parentNode.parentNode.parentNode.parentNode.remove();

            document.querySelector(".numberOfFiles").textContent=`(${mainPersonData.ArrayOfFilesLinks.length})`
            Swal.fire('تم حذف الملف','','success');
          });

          
    
        };
      });

  };

});




/* start file upload drag and drob //////////////////*/

let DivForDragFiles = document.querySelector(".DivForDragFiles");

function showDivForDragFiles(){
  DivForDragFiles.style.display="block";
};

function hideDivForDragFiles(){
  DivForDragFiles.style.display="none";
};


let dropArea = document.querySelector('.drop_box')
dropArea.addEventListener('dragenter', showDivForDragFiles, false)
DivForDragFiles.addEventListener('dragleave', hideDivForDragFiles, false)


let upload = document.getElementById('upload');

function onFile() {
  let files = upload.files;
  DivForDragFiles.style.display="none";
  mainInput.files=files;
  numberOfFilesSelect.textContent=`
  تم تحديد 
  ${mainInput.files.length} 
  ملف
  `;
  numberOfFilesSelect.style.display="block";
  restInput.style.display="block";
  console.log(files);
}


upload.addEventListener('dragdrop', function (e) {
    onFile();
}, false);

upload.addEventListener('change', function (e) {
    onFile();
}, false);



/* end file upload drag and drob //////////////////*/
