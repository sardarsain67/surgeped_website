const menubtn = document.querySelector('.menu-btn2');
const menuitems = document.querySelector('.navItemsRightInBody')
const menuitemsPrev = document.querySelector('.navItemsRight')


menubtn.addEventListener('click', ()=>{
    menubtn.classList.toggle("open");
    document.body.classList.toggle('stop-scroll');
    menuitems.classList.toggle("showNavItemsRightInBody");
    console.log("beforew scrollstop");

    console.log("below scrollstop");

});
