// import data and locatization file 
import de from '../data/de.json' assert { type: 'json' };
import en from '../data/en.json' assert { type: 'json' };
import loc from '../data/localization.json' assert { type: 'json' };

//set default location hash for localization
location.hash = '#de'
// localization of the meal plan
var lang = window.location.hash !== undefined ? window.location.hash : '#de'
var mealPlan = lang === '#en' ? en : de

//creating the button row dynamically from data. First objects has to be the types.
function createBtnRow() {
    for(var key in mealPlan) {
        console.log(key)
        var button = document.createElement("button")
        button.className = "button"
        button.id = "btn_" + key 
        //button.onclick = window.changeLanguage(key)
        button.setAttribute("onclick", "showRandomMeal('" + key + "')")
        button.textContent = loc[location.hash].buttons[key]
        document.getElementById("btnRow").appendChild(button)
    }
}

// Build a dyn div with nutrient table and list for shopping and the recipe steps
function buildMealHtml(meal) {
    function createDiv(theClass) {
        var div = document.createElement("div");
        if (typeof theClass === "string") {
            div.className = theClass;
            div.id = theClass
        }
        return div;
    }
    function createUl() {
        var ul = document.createElement("ul");
        return ul;
    }
    function createOl() {
        var ol = document.createElement("ol");
        return ol;
    }
    function createThead() {
        var thead = document.createElement("thead");
        var tr = thead.appendChild(document.createElement("tr"))

        // iterate over the localization object and produce the table header items
        let localizationObject = loc[location.hash].nutrition
        for (var key in localizationObject) {
            var th = tr.appendChild(document.createElement('th'))
            th.textContent = localizationObject[key]
        }
        return thead;
    }
    // create a custom not generic table
    function createTable() {
        var table = document.createElement("table");
        table.className = 'u-full-width';
        table.appendChild(createThead())
        var tbody = table.appendChild(document.createElement('tbody'))
        var tr = tbody.appendChild(document.createElement('tr'))
        for (var key in meal) {
            if (key !== 'shoppingList' && key !== 'recipe' && key !== 'name') {
                var td = tr.appendChild(document.createElement('td'))
                td.textContent = meal[key]
            }
        }
        return table;
    }
    // create a list item 
    function createListItem(text) {
        var list = document.createElement("li");
        list.textContent = text
        return list;
    }
    // create a custom not generic unordered list
    function createUnordedList(listTexts, divClass) {
        listTexts = (typeof listTexts === "string") ? [listTexts] : listTexts;
        divClass = (typeof divClass === "undefined") ? "six columns" : divClass;
        var div = createDiv(divClass);
        var header = document.createElement('h5')
        header.textContent = loc[location.hash].todo.shoppingList
        div.appendChild(header)
        var ul = div.appendChild(createUl())
        if (Array.isArray(listTexts)) {
            listTexts.forEach(
                function (listText) {
                    ul.appendChild(createListItem(listText));
                });
        }
        return div;
    }
    // create a custom not generic ordered list
    function createOrderedList(listTexts, divClass) {
        listTexts = (typeof listTexts === "string") ? [listTexts] : listTexts;
        divClass = (typeof divClass === "undefined") ? "six columns" : divClass;
        var div = createDiv(divClass)
        var header = document.createElement('h5')
        header.textContent = loc[location.hash].todo.recipe
        div.appendChild(header)
        var ol = div.appendChild(createOl())
        if (Array.isArray(listTexts)) {
            listTexts.forEach(
                function (listText) {

                    ol.appendChild(createListItem(listText));
                });
        }
        return div;
    }
    let mainDiv = createDiv('content')
    // header for recipe is meal.name
    let recipeName = document.createElement("h5")
    recipeName.textContent = meal.name

    // build shopping list/recipe section
    let shoppingList = createUnordedList(meal.shoppingList)
    let recipe = createOrderedList(meal.recipe)
    let row = createDiv('row')
    row.appendChild(shoppingList)
    row.appendChild(recipe)

    // append the different sections in correct order. 
    mainDiv.appendChild(document.createElement("br"))
    mainDiv.appendChild(recipeName)
    mainDiv.appendChild(createTable())
    mainDiv.appendChild(row)
    return mainDiv
}


export function changeLanguage(lang) {
    location.hash = lang;
    if (lang === 'de') {
        // change the language buttons
        document.getElementById("btnLangDe").innerText = loc[location.hash].buttons.locDe
        document.getElementById("btnLangEn").innerText = loc[location.hash].buttons.locEn
        document.getElementById("btnLangDe").classList.add("button-primary")
        document.getElementById("btnLangEn").classList.remove("button-primary")
        // change title and description
        document.getElementById("title").textContent = loc[location.hash].title
        document.getElementById("description").textContent = loc[location.hash].description
        // change the type buttons
        for(var key in mealPlan) {
            document.getElementById("btn_" + key).innerText = loc[location.hash].buttons[key]
        }
    }
    else if (lang === 'en') {
        // change the language buttons
        document.getElementById("btnLangDe").innerText = loc[location.hash].buttons.locDe
        document.getElementById("btnLangEn").innerText = loc[location.hash].buttons.locEn
        document.getElementById("btnLangDe").classList.remove("button-primary")
        document.getElementById("btnLangEn").classList.add("button-primary")
        // change title and description
        document.getElementById("title").textContent = loc[location.hash].title
        document.getElementById("description").textContent = loc[location.hash].description
        // change the type buttons
        for(var key in mealPlan) {
            document.getElementById("btn_" + key).innerText = loc[location.hash].buttons[key]
        }
    }
    document.getElementById("content").innerHTML = '';
}

export function showRandomMeal(mealType) {
    var meals = mealPlan[mealType];
    var randomIndex = Math.floor(Math.random() * meals.length);
    var meal = meals[randomIndex];

    var mealHtml = buildMealHtml(meal)
    // remove current content if exist
    if (document.getElementById('content')) {
        document.getElementById('content').remove()
    }
    document.getElementById("result").appendChild(mealHtml);
}

//Initialze the application
document.getElementById("title").textContent = loc[location.hash].title
document.getElementById("description").textContent = loc[location.hash].description
createBtnRow()