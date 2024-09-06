// Get the category list and the "View All" button


/*var categoryList = document.querySelector('.category-list');
var viewAllBtn = document.querySelector('.view-all-categories');


// Get all the category items
var categoryItems = document.querySelectorAll('.category-item');

// Set the number of visible categories to 4
var numVisibleCategories = 4;

// Hide the category items that are not visible by default
for (var i = numVisibleCategories; i < categoryItems.length; i++) {
    categoryItems[i].style.display = 'none';
}

// Add an event listener to the "View All" button
viewAllBtn.addEventListener('click', function() {
    // Toggle the visibility of the hidden category items
    for (var i = numVisibleCategories; i < categoryItems.length; i++) {
        if (categoryItems[i].style.display === 'none') {
            categoryItems[i].style.display = 'flex';
        } else {
            categoryItems[i].style.display = 'none';
        }
    }

    // Toggle the text of the "View All" button
    if (viewAllBtn.innerHTML === 'View All +') {
        viewAllBtn.innerHTML = 'View Less -';
    } else {
        viewAllBtn.innerHTML = 'View All +';
    }
});
*/




//shooting start
const shootingStar = document.getElementById("shooting-star");

document.addEventListener("mousemove", function (event) {
    shootingStar.style.top = event.clientY + window.scrollY + "px";
    shootingStar.style.left = event.clientX + "px";
    shootingStar.style.animationPlayState = "running";
});

document.addEventListener("mouseout", function () {
    //shootingStar.style.animationPlayState = "paused";
});


const heroreadmore = document.getElementsByClassName("hero-read-more");

heroreadmore[0].addEventListener('click', () => {
    const section = document.querySelector('.blog-page-blog-container');
    section.scrollIntoView({behavior: "smooth"});
});