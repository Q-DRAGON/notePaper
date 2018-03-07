// todoList 数组
var toDoList = []

// 绑定事件
var bindEvent = function() {
    var addAlert = document.querySelector('#id-button-alert')
    var addButton = document.querySelector('.note-add')
    var todoContainer = document.querySelector('#id-div-container')
    var todoArea = document.querySelector('#id-textarea-todo')
    var alertMask = document.querySelector('.alert-mask')
    // 点击添加按钮弹出发表弹窗
    // addAlert.addEventListener('click', function(){
    //     if(alertMask.classList.contains('alert-hide')) {
    //         alertMask.classList.remove('alert-hide')
    //     }
    // })

    // 点击弹窗阴影区域取消弹窗
    alertMask.addEventListener('click', function(){
        console.log('target', event.target)
        var target = event.target
        if(target.classList.contains('alert-mask')){
            alertMask.classList.add('alert-hide')
        }
    })

    // 点击发表按钮添加标签，并保存在 localStorage
    addButton.addEventListener('click', function(){
        console.log('addButton')
        var target = event.target
        var todoInput = document.querySelector('#id-input-todo')
        var content = todoArea.value
        if(content !== '') {
            // 生成 todo 对象
            var todo = {
                'content': content,
                'time': currentTime(),
                'id': todoId()
            }
            //把新事项添加进列表数组
            toDoList.push(todo)
            console.log('click', toDoList)
            //保存
            savetodos()
            insertTodo(todo)
            alertMask.classList.add('alert-hide')
        }
    })

    // 通过 event.target 的 class 来检查点击的是什么
    todoContainer.addEventListener('click', function(event){
        console.log('container click', event, event.target)
        var target = event.target
        if(target.classList.contains('todo-delete')) {
            console.log('delete')
            var todoDiv = target.parentElement.parentElement
            console.log('target :', target)
            console.log('target.parentElement',  target.parentElement)
            var dataId = Number(todoDiv.dataset.id)
            deletetodo(dataId)
        }  else if (target.classList.contains('todo-edit')) {
                var cell = target.parentElement.parentElement
                console.log('cell', cell)
                var span = cell.querySelector('.todo-content')
                console.log('span', span)
                // 设置特定属性值
                span.setAttribute('contenteditable', 'true')
                span.focus()
        }
    })


    todoContainer.addEventListener('keydown', function(event){
        console.log('keydown', event, event.target)
        var target = event.target
        if(event.key === 'Enter') {
            console.log('敲击回车')
            // 失焦
            target.blur()
            // 阻止默认动作(插入回车)
            event.preventDefault()
            var todoDiv = target.parentElement
            //更新todo
            var dataId = Number(todoDiv.dataset.id)
            var content = target.innerHTML
            updatetodo(dataId, content)
            // 把元素在 todoList 中更新
            savetodos()
        }
    })

    var GuaEventType = {
        blur: 'blur',
        click: 'click',
    }

    // 鼠标点击其他地方失焦 并 锁定
    todoContainer.addEventListener('blur', function(event){
        console.log('GuaEventType.blur', GuaEventType.blur)
        console.log('container blur', event, event.target)
        var target = event.target
        if (target.classList.contains('todo-content')) {
            console.log('update and save')
            // 让 span 不可编辑
            target.setAttribute('contenteditable', 'false')
            //更新todo
            var todoDiv = target.parentElement
            var dataId = Number(todoDiv.dataset.id)
            var content = target.innerHTML
            updatetodo(dataId, content)
            // 把元素在 todoList 中更新
            savetodos()
        }
    },true)

    // 输入字符时检测字符数，以确保字符数在指定范围内
    todoArea.addEventListener('input', function(event){
        var wordCount = document.querySelector('.word-count')
        // 限制字数在指定范围内
        todoArea.value = todoArea.value.substring(0, 140)
        var string = todoArea.value.length
        var count = 140 - `${string}`
        console.log(count, typeof count)
        wordCount.innerHTML = `${count}`
    })

    // var arrow = document.querySelector('.aside-arrow')
    // arrow.addEventListener('mouseover')
}

// 更新 todo
var updatetodo = function(dataid, content) {
    console.log('dataid', dataid)
    // 从 todoList 中删除
    for(let i = 0; i < toDoList.length; i++) {
        if(toDoList[i].id == dataid) {
            console.log('i', i)
            toDoList[i].content = content
            break
        }
    }
}

// 删除 todo
var deletetodo = function(dataid) {
    // 从 todoList 中删除
    for(let i = 0; i < toDoList.length; i++) {
        if(toDoList[i].id == dataid) {
            console.log('i', i)
            toDoList.splice(i, 1)
            var index = i
            break
        }
    }
    // 重新编号
    for(let i = 0; i < toDoList.length; i++) {
        if(i >= index) {
            toDoList[i].id = toDoList[i].id - 1
        }
    }
    // 保存到 localStorage
    savetodos()
    // 重新加载到页面
    var todoContainer = document.querySelector('#id-div-container')
    todoContainer.innerHTML = ''
    looptoDoList()
}

// 循环 todoList 把 div 添加的页面
var looptoDoList =  function() {
    if(loadtodos() !== false) {
        toDoList = loadtodos()
        console.log('looptoDoList启动')
        for(let i = 0; i < toDoList.length; i++) {
            var todo = toDoList[i]
            insertTodo(todo)
        }
    }
}

// 添加 todo
var insertTodo = function(todo, done) {
    // 添加到 container 中
    var todoContainer = document.querySelector('#id-div-container')
    var t = templateTodo(todo, done)
    // 这个方法用来添加元素
    // 第一个参数 'beforeend' 意思是放在最后
    todoContainer.insertAdjacentHTML('beforeend', t);
}

// todo 的模板
var templateTodo = function(todo, done) {
    var status = ''
    if(done) {
        status = 'done'
    }
    var t = `
        <div class='todo-cell ${status}' data-id=${todo.id}>
            <div>
                <i class='iconfont icon-lajixiang todo-delete'></i>
                <i class='iconfont icon-edit_icon todo-edit'></i>
            </div>
            <span class='todo-content' contenteditable='true'>${todo.content}</span>
            <span class='todo-time'>${todo.time}</span>
        </div>
    `
    return t
}

// 分配 todo 项目的 id
var todoId = function() {
    var id = 0
    if(toDoList.length > 0) {
        var id = toDoList.length
    }
    return id
}

// 把 toDoList 保存进 localStorage
var savetodos = function() {
    var s = JSON.stringify(toDoList)
    console.log('序列化后的字符串', typeof s, s)
    localStorage.toDoList = s
}

// 载入 localStorage 里的 toDoList
var loadtodos = function() {
    var a = localStorage.toDoList
    if(a !== undefined) {
        console.log('反序列化后的数组', typeof a, a)
        return JSON.parse(a)
    }
    return false
}

// 时间模板
var currentTime = function() {
    var d = new Date()
    var month = d.getMonth() + 1
    var year = d.getFullYear()
    var date = d.getDate()
    var hours = d.getHours()
    var minutes = d.getMinutes()
    var seconds = d.getSeconds()
    var timeString = `${year}/${month}/${date} ${hours}:${minutes}:${seconds}`
    return timeString
}


var _main = function() {
    looptoDoList()
    bindEvent()
}

_main()
