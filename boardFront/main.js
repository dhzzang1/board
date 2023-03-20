
const listWrap = document.getElementById('accordion');
let updateData =null;

const init = ()=>{
    changeTab("accordion")
    // setTimeout(()=>{
    //     changeTab('accordion')
    //     setTimeout(()=>{
    //         changeTab('write')
    //     },5000)
    // },5000)
  
}



/* =========================================================================== */
/* 이벤트 */

// 홈버튼
document.getElementById('home').addEventListener('click',e=>{
    changeTab('accordion');
})

// 글쓰기
document.getElementById('btn-write').addEventListener('click',e=>{
    changeTab('write');
})

// 글작성
document.getElementById('btn-submit').addEventListener('click',e=>{
    addPost(
        document.getElementById('title').value
        ,document.getElementById('desc').value
        ,document.getElementById('name').value
        ,document.getElementById('password').value
    )
})

// 글수정
document.getElementById('btn-submit2').addEventListener('click', async e=>{
    const id = updateData.id;
    const password = document.getElementById('password2').value;
    const title = document.getElementById('title2').value;
    const desc = document.getElementById('desc2').value;
    try{
        await API.post('/board/update',{id, password, title, desc})
        changeTab("accordion");
    }catch(error){
        alert('비밀번호를 확인해주세요.')
    }
    
    // 125,000
    // 20,000
    // 100,000 + 20,000
    //data ? updatePost() : alert('비밀번호를 확인해주세요.');
})


/* =========================================================================== */
/* function */

// axios
const createApi = (flag)=> (url,params={}) => axios[flag](`http://localhost:8080${url}`,params)
const API = {
    get:createApi('get'),
    post:createApi('post')
}

// 게시글 가져오기
const getList = ()=>{
    API.get('/board/list')
    .then(response => {
    console.log(response.data)
    const list = response.data;
    listWrap.innerHTML = response.data?.map(board => {
            const {id,title,desc,name,updatedAt}= board
        return `
            <div class="accordion-item">
                <h2 class="accordion-header" id="board-${id}">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#board-${id}-heading" aria-expanded="false" aria-controls="board-${id}-heading">
                    ${title}
                    <span style="margin-left: auto;">작성자 : ${name}<br>작성일 : ${updatedAt}</span>
                    </button>
                </h2>
                <div id="board-${id}-heading" class="accordion-collapse collapse" aria-labelledby="board-${id}" data-bs-parent="#accordionExample">
                    <button type="button" class="btn btn-light btn-update" data-key="${id}">수정</button>
                    <div class="accordion-body">
                    ${desc}
                    </div>
                    
                </div>
             </div>
            `;
    })
    .join('');

    /* 글 수정 */
    document.querySelectorAll('.btn-update').forEach(el=>{

        el.addEventListener('click', ()=>{
            updateData = list.find((v)=>{
                return v.id == el.getAttribute('data-key');
            });
            changeTab("update");
           })
    })
  })
}

/**
 * 화면 전환
 * @param {'accordion'|'write'|'update'} tabName 
 */
const changeTab = (tabName) =>{
    Array.from(document.getElementsByClassName('page')).forEach(el => {
        el.className = el.className.replace('show', '')
    });
    document.getElementById(tabName).className += ' show'

    if(tabName=='accordion'){
        getList()

    }else if(tabName=='write'){
        ['name','password','title','desc'].forEach(id=>{
            const el = document.getElementById(id)
            el.value = ''
        })
    }else if(tabName=="update"){
        document.getElementById('title2').value = updateData.title;
        document.getElementById('desc2').value = updateData.desc;
        document.getElementById('name2').value = updateData.name;
    }
}

// 게시글 작성
const addPost = (title,desc,name,password)=>{
    API.post('/board/',{title,desc,name,password})
    .then(()=>changeTab('accordion'));

}







init();


//test