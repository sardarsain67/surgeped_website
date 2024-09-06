SlideBtn = document.getElementById("SlideBtn")

/*
TstmnlContent = document.getElementsByClassName('TstmnlContent')
let click=0;
TstChildren= Array.from(TstmnlContent[0].children)
//const menubtn = document.querySelector('.menu-btn2');
//const menuitems = document.querySelector('.navItemsRightInBody')
//const menuitemsPrev = document.querySelector('.navItemsRight')

SlideBtn.addEventListener('click', () => {

    //console.log(TstChildren)

    click++;
    TstChildren.forEach((childd) => {
        if(childd.classList.contains('active')){
            switch (click){
                case 0:
                    TstmnlContent[0].style.transform = "translateX(-13px)";
                    break
                case 1:
                    //TstmnlContent[0].style.transform = "translateX(-634px)";

                    TstmnlContent[0].style.transform = "translateX(-648px)";
                    break
                case 2:
                    TstmnlContent[0].style.transform = "translateX(-1279px)";
                    break

                case 3:
                    TstmnlContent[0].style.transform = "translateX(-1910px)";
                    break

                case 4:
                    TstmnlContent[0].style.transform = "translateX(-2541px)";
                    break
                case 5:
                    TstmnlContent[0].style.transform = "translateX(-13px)";
                    click=0;
                    break
            }
        }
    })*/



   /* if(TstmnlContent[0].style.transform === "translateX(-1268px)")
    {
        TstmnlContent[0].style.transform = "translateX(0px)";
    }
    else{
        TstmnlContent[0].style.transform += "translateX(-634px)";

    }*/
/*
})
*/
/*
menubtn.addEventListener('click', ()=>{
    menubtn.classList.toggle("open");
    document.body.classList.toggle('stop-scroll');
    menuitems.classList.toggle("showNavItemsRightInBody");
    console.log("beforew scrollstop");

    console.log("below scrollstop");

})*/



// Select the navbar element
/*const navbar = document.querySelector("nav");

// Set the threshold for when the box shadow should appear (in pixels)
const threshold = 704;

// Listen for scroll events
window.addEventListener("scroll", function() {
    // Get the current scroll position
    const scrollPosition = window.scrollY;
    //console.log(scrollPosition);

    // Check if the scroll position is greater than the threshold
    if (scrollPosition > threshold) {
        // If so, add the box shadow style to the navbar
        navbar.style.boxShadow = "rgba(0, 0, 0, 0.24) 0px 3px 8px";
    } else {
        // If not, remove the box shadow style
        navbar.style.boxShadow = "none";
    }
});*/



const swiper = new Swiper('.swiper', {
    // Optional parameters
    direction: 'horizontal',
    loop: true,

    // If we need pagination
    pagination: {
        el: '.swiper-pagination',
    },

    // Navigation arrows
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },

    // And if we need scrollbar
    scrollbar: {
        el: '.swiper-scrollbar',
    },
});


//services load more

const loadMoreBtn = document.getElementById("loadMoreBtn");
const collapseBtn = document.getElementById("collapseBtn");
const srvcContainer = document.querySelector(".SrvcContainer");
const initialHeight = srvcContainer.offsetHeight; // get the initial height of the container


// Add click event listener to the Load More button
loadMoreBtn.addEventListener("click", () => {
    // Expand the container to show all service items
    srvcContainer.style.height = `${srvcContainer.scrollHeight}px`;

    // Hide the Load More button and show the Collapse button
    loadMoreBtn.style.display = "none";
    collapseBtn.style.display = "block";
});

// Add click event listener to the Collapse button
collapseBtn.addEventListener("click", () => {
    // Collapse the container to its initial height
    srvcContainer.style.height = `${initialHeight}px`;

    // Show the Load More button and hide the Collapse button
    loadMoreBtn.style.display = "block";
    collapseBtn.style.display = "none";
});