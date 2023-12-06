
const state={
    taskList: []
}
const taskContents=document.querySelector(".task__contents")
const modalContents=document.querySelector(".task__modal_body")
const updateStorage= ()=>{
    localStorage.setItem('storedState', JSON.stringify({ tasks : state.taskList}))
}
openTask = (id)=>{
    const getTask = state.taskList.find((item) => item.id === id);
    modalContents.innerHTML = htmlModalContent(getTask);
}

const deleteTask=(id)=>{
    const newTasklist = state.taskList.filter((item)=>item.id!==id)
    state.taskList=newTasklist
    updateStorage()
    document.getElementById(id).remove()
}

const saveTask = (id)=>{
    const card= document.getElementById(id)
    card.querySelector('.card-title').setAttribute('contenteditable','false') 
    card.querySelector('.card-description').setAttribute('contenteditable','false') 
    card.querySelector('.card-type').setAttribute('contenteditable','false') 
    const footer = card.querySelector('.card-footer')
    footer.innerHTML= `<button type="button" class="btn btn-outline-primary float-end" data-bs-toggle="modal" 
    data-bs-target="#sampleModal" onclick="openTask(${id})">Open Task</button>`
    const title = card.querySelector('.card-title').textContent
    const type = card.querySelector('.tags').textContent
    const desc = card.querySelector('.card-description').textContent
    state.taskList=state.taskList.map((item)=>{if(item.id === id) return {...item, title: title,type:type,description:desc}; else return item})
    console.log(state.taskList)
    updateStorage()
}

const editTask=(id)=>{
    const handleInput = (e)=>{
        if (e.target.innerText.trim()==='') e.target.innerText = ' '
    }
    const card = document.getElementById(id)
    const footer = card.querySelector('.card-footer')
    footer.innerHTML = `<button type="button" class="btn btn-outline-primary float-end" onclick="saveTask(${id})">Save changes</button>`
    card.querySelector('.card-title').setAttribute('contenteditable','true') 
    card.querySelector('.card-description').setAttribute('contenteditable','true') 
    card.querySelector('.card-type').setAttribute('contenteditable','true') 
    //card.querySelector('.card-type').setAttribute('oninput','handleinput(e)') 
    card.querySelector('.card-type').addEventListener('input', handleInput)
    console.log(state.taskList)
    }


const htmlTaskContent=({id,title,description,url,type})=>{
    return(
    `<div class="col-md-6 col-lg-4 mt-4" id=${id} >
        <div class="card shadow task__cards">
        <div class="card-header d-flex gap-2 justify-content-end task __card_header">
        <button type='button' class='btn btn-outline-info mr-2' name=${id} onclick="editTask(${id})"><i class='fas fa-pencil-alt'></i></button>
        <button class="btn btn-outline-danger mr-2" name=${id} onclick="deleteTask(${id})"><i class="fas fa-trash-alt"></i></button>
        
        </div>
        <div class="card-body">
        ${
            url ? `<img src=${url} alt='card img' class='card-img-top md-3 rounded-md'/>`
            :
            `<img class='card-img-top md-3 rounded-md' src = 'https://media.istockphoto.com/id/1354776457/vector/default-image-icon-vector-missing-picture-page-for-website-design-or-mobile-app-no-photo.jpg?s=612x612&w=0&k=20&c=w3OW0wX3LyiFRuDHo9A32Q0IUMtD4yjXEvQlqyYk9O4='/>`
        }
        <h4 class='card-title p-2'>${title}</h4>
                <p class='card-text text-muted card-description'>${description}</p>
                <div class='tags d-flex flex-wrap'>
                    <span class='badge card-type text-white bg-primary m-1'>${type}</span>
                </div>
            </div>
             <div class='card-footer'>
                <button type="button" class="btn btn-outline-primary float-end" data-bs-toggle="modal" 
                data-bs-target="#sampleModal" onclick="openTask(${id})">Open Task</button>
                
            </div>
        </div>
    </div>`
    )
}

const htmlModalContent = ({id, title, description, url, type}) => {
        const date = new Date(parseInt(id));
        document.getElementById("sampleModalLabel").innerHTML = title
        return `
        <div id=${id}>
            ${
                        url && 
                         `<img src=${url} alt='card image' class='img-fluid rounded place__holder__image mb-3 '/>`
                    }
            <strong class='text-sm text-muted'>Created on ${date.toDateString()}</strong>    
             <h4 class='my-2'>${type}</h4>  
              <p class='lead text-muted'>${description}</p>  
            

        </div>
        `
    };



const initialData = ()=>{
    const localStorageCopy = JSON.parse(localStorage.getItem('storedState'))
    if(localStorageCopy) state.taskList = localStorageCopy.tasks
    console.log(localStorageCopy)
    state.taskList.map((item)=>{
        taskContents.insertAdjacentHTML('afterbegin', htmlTaskContent(item))
    })
}

const handleSubmit = ()=>{
    const id= Date.now()
    const item={
    title: document.getElementById('tasktitle').value,
    description : document.getElementById('taskdescription').value,
    type : document.getElementById('tasktype').value,
    url : document.getElementById('imageurl').value
    }
   if(item.url==='') item.url = 'https://media.istockphoto.com/id/1354776457/vector/default-image-icon-vector-missing-picture-page-for-website-design-or-mobile-app-no-photo.jpg?s=612x612&w=0&k=20&c=w3OW0wX3LyiFRuDHo9A32Q0IUMtD4yjXEvQlqyYk9O4='
    if(item.title==='' || item.type==='') alert('please input title and type')
    else{
    taskContents.insertAdjacentHTML('afterbegin',htmlTaskContent({...item, id}))
    state.taskList.push({...item,id})
    updateStorage()
    }
}
const searchTask = (event)=>{
    taskContents.innerHTML = '';

    const tasksCopy = state.taskList.filter((item) => item.title.includes(event.target.value));

    if (tasksCopy.length > 0) {
        tasksCopy.forEach((task) => {
            taskContents.insertAdjacentHTML('beforeend', htmlTaskContent(task));
        });
    } else {
        taskContents.innerHTML = `<p>No tasks found</p>`;
    }
    
}




//localStorage.removeItem('storedState')




