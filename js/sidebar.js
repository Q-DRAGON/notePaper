var sidebar = function() {
    this.init()
    this.bind()
}

sidebar.prototype.init = function() {
    this.state = 'opened'
    this.el = document.querySelector('#sidebar')
    this.closeButton = document.querySelector('#sidebar-close-button')
    this.sidebarItem = document.querySelectorAll('.sidebar-item')
    this.nav = document.querySelector('#nav-content')
    this.navCC = document.querySelector('#nav-con-close')
    this.skin = document.querySelectorAll('.nav-skin')
}

sidebar.prototype.bind = function() {
    var self = this
    // 如果点击的是关闭 sidebar 按钮
    this.closeButton.addEventListener('click', function(){
        var state = self.closeButton.dataset.state
        if(state == 'opened') {
            self.close()
        } else if (state === 'closed') {
            self.open()
        }
    })

    // 如果点击的是关闭 menubar 按钮
    this.navCC.addEventListener('click', function(){
        var state = self.nav.dataset.state
        if(state == 'opened') {
            self.menuClose()
        } else if (state === 'closed') {
            self.menuOpen()
        }
    })

    // 如果点击的是皮肤中的一个
    for(let i = 0; i < this.skin.length; i++) {
        console.log('this', this.skin)
        this.skin[i].addEventListener('click', function(){
            console.log('click', event.target)
            var id = event.target.dataset.id
            console.log('id', id)
            var skintem = `background-image: url(img/${id}.jpg)`
            document.querySelector('body').setAttribute('style', skintem)
            // document.querySelector('body').style.background-image = `url(../img/${id}.jpg)`
        })
    }

    // 检测点击的是哪个项目按钮
    for(let i = 0; i < this.sidebarItem.length; i++) {
        this.sidebarItem[i].addEventListener('click', function(){
            var target = event.target
            // 如果点击的是添加按钮, 则跳出添加弹窗
            if(target.classList.contains('sidebar-add')) {
                console.log('add')
                var alertMask = document.querySelector('.alert-mask')
                if(alertMask.classList.contains('alert-hide')) {
                    alertMask.classList.remove('alert-hide')
                }
            // 如果点击的是皮肤按钮
            } else if (target.classList.contains('sidebar-skin')) {
                console.log('skin')
                var state = self.nav.dataset.state
                if(state == 'opened') {
                    self.menuClose()
                } else if (state === 'closed') {
                    self.menuOpen()
                }
            }
        })
    }
}

sidebar.prototype.menuClose = function() {
    console.log('menu关闭')
    this.nav.className ='menubar-move-left'
    this.nav.dataset.state = 'closed'
}

sidebar.prototype.menuOpen = function() {
    console.log('menu打开')
    this.nav.className ='menubar-move-right'
    this.nav.dataset.state = 'opened'
}

sidebar.prototype.close = function() {
    console.log('关闭')
    this.el.className ='siderbar-move-left'
    this.closeButton.style.left = '120px'
    this.closeButton.className = 'closeButton-move-right'
    this.closeButton.dataset.state = 'closed'
    this.nav.className ='menubar-move-left'
    this.nav.dataset.state = 'closed'
}

sidebar.prototype.open = function() {
    console.log('打开')
    this.el.className ='siderbar-move-right'
    this.closeButton.style.left = '190px'
    this.closeButton.className = 'closeButton-move-left'
    this.closeButton.dataset.state = 'opened'
}

var hua = new sidebar()
