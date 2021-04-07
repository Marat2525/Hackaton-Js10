const API = 'http://localhost:8009/themes';
const btn = $('.btn-add');
const btnAdd = $('.add');
const newElem = $('.div-for-append')
const inp1 = $('.modal_inp-name');
const inp2 = $('.modal_inp-descript');
let searchText = "";
let pageCount = 1;
let page = 1;
let editedId = null;

render()

//Поиск
$('.search-inp').on('input', function(e){
    searchText = e.target.value;
    render()
})

//Событие на кнопку добавить тему
btn.on('click', function(){
    $('.main-modal').css('display', 'block');
})

//Событие на кнопку внутри модлки №1
btnAdd.on('click', function(){
    if(!inp1.val().trim()){
        alert('заполните поле');
    if(!inp2.val().trim()){
        alert('заполните второе поле')
    }
        inp1.val('')
        inp2.val('')
        return
    }

    let newTheme = {
        theme: inp1.val(),
        link: inp2.val()
    }
    postNewTheme(newTheme);
    inp1.val('');
    inp2.val('');
})

//Функция с запросом POST
function postNewTheme(newTheme){
    fetch(API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(newTheme) 
    })
    .then(() => render());
}

//Рендер
async function render(){
    let res = await fetch(`${API}?q=${searchText}&_page=${page}&_limit=12`);
    let data = await res.json();
    newElem.html('');
    getPagination();
    data.forEach(item => {
            newElem.append(`
                <div class="styleOfElem" id=${item.id}>
                    <a ${item.link ? `href=${item.link}` : null} target="_blank">
                            ${item.theme}
                    </a>
                    <button class="btn-delete">Delete</button>
                    <button class="btn-edit">Edit</button>
                </div>
            `)
    });
}



//Закрытие модалки №1
$('.close_btn').on('click', function(){
    $('.main-modal').css('display', 'none')
})

//Удаление
$('body').on('click', '.btn-delete', function(e){
    let id = e.target.parentNode.id;
    fetch(`${API}/${id}/`, {
        method: 'DELETE'
    })
    .then(() => render())
})

//Редактирование
$('body').on('click', '.btn-edit', function(e){
    editedId = e.target.parentNode.id;

    fetch(`${API}/${editedId}/`)
        .then(res => res.json())
        .then(themeToEdit => {
            $('.modal_edit_name').val(themeToEdit.task);
            $('.modal-for-edit').css('display', 'block')

    })
})

//Сохранение
$('.save').on('click', function(e){
    if (!$('.modal_edit_name').val().trim()){
        alert('Заполните поле');
        $('.modal_edit_name').val('')
        return
    }

    let editedTheme = {
        theme: $('.modal_edit_name').val()
    }
    fetch(`${API}/${editedId}/`, {
        method: 'PUT',
        body: JSON.stringify(editedTheme),
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }
    })
        .then(() => {
            render()
            $('.modal-for-edit').css('display', 'none')
        })
})    

//Закрытие модалки №2
$('.edit-for-btn').on('click', function(){
    $('.modal-for-edit').css('display', 'none')
})

//Пагинация
getPagination()
function getPagination(){
    fetch(`${API}?q=${searchText}`)
    .then(res => res.json())
    .then(data => {
        pageCount = Math.ceil(data.length/12)
        $('.pagination-page').remove()
        for(let i=pageCount; i >= 1; i--){
            $('.previous-btn').after(`
            <span class="pagination-page">
                <a href="#">${i}</a>
            </span>`)
        }
    })
}

$('.next-btn').on('click', function(){
    if(page >= pageCount) return
    page++
    render()
})

$('.previous-btn').on('click', function(){
    if(page <= 1) return
    page--
    render()
})
    
$('body').on('click', '.pagination-page', function(e){
    page = e.target.innerText;
    render()
})




