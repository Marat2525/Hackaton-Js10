const API = 'http://localhost:8009/themes';
const btn = $('.btn-add');
const btnAdd = $('.add');
const newElem = $('.div-for-append')
const inp1 = $('.modal_inp-name');
const inp2 = $('.modal_inp-descript');

render()


//Событие на кнопку добавить тему
btn.on('click', function(){
    $('.main-modal').css('display', 'block');
})

//Событие на кнопку внутри модлки №1
btnAdd.on('click', function(){
    if(!inp1.val().trim()){
        alert('заполните поле');
        inp1.val('')
        return
    }

    let newTheme = {
        theme: inp1.val()
    }
    postNewTheme(newTheme);
    inp1.val('');
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
    let res = await fetch(API);
    let data = await res.json();
    newElem.html('');
    data.forEach(item => {
            newElem.append(`
            <div class="styleOfElem" id=${item.id}>${item.theme}
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
        .then(taskToEdit => {
            $('.edit-inp').val(taskToEdit.task);
            $('.modal-for-edit').css('display', 'block')
    })
})

//Сохранение
$('.save').on('click', function(e){
    if (!$('.modal_edit-name').val().trim()){
        alert('Заполните поле');
        $('.modal_edit-name').val('')
        return
    }

    let editedTheme = {
        theme: $('.modal_edit-name').val()
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



