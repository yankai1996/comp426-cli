/**
 * Course: COMP 426
 * Assignment: a05
 * Author: <type your name here>
 *
 * This script uses jQuery to build an HTML page with content taken from the
 * data defined in data.js.
 */



/**
 * Given a hero object (see data.js), this function generates a "card" showing
 *     the hero's name, information, and colors.
 * @param hero  A hero object (see data.js)
 */
export const renderHeroCard = function(hero) {
    // Generate HTML elements to represent the hero
    // Return these elements as a string, HTMLElement, or jQuery object
    let year = hero.firstSeen.getFullYear();
    let month = hero.firstSeen.getMonth() + 1;
    let day = hero.firstSeen.getDate();
    return `
        <div id="hero${hero.id}" class="column">
            <div class="card">
                <div class="card-banner" style="background-color:${hero.backgroundColor}">
                    <img src="${hero.img}">
                    <h1 class="name" style="color:${hero.color}">${hero.name}</h1>
                </div>
                <div class="card-content">
                    <h2 class="subtitle has-text-grey is-italic">"${hero.subtitle}"</h2>
                    <p><span>Alter ego:</span> ${hero.first} ${hero.last}</p>
                    <p><span>First apperance:</span> ${month}/${day}/${year}</p>
                    <p class="description">${hero.description}</p>
                    <div class="buttons">
                        <button id="edit${hero.id}" class="button is-gray edit">Edit</button>
                    </div>
                </div>
            </div>
        </div>`
};



/**
 * Given a hero object, this function generates a <form> which allows the
 *     user to edit the fields of the hero. The form inputs should be
 *     pre-populated with the initial values of the hero.
 * @param hero  The hero object to edit (see data.js)
 */
export const renderHeroEditForm = function(hero) {
    // Generate HTML elements to represent the hero edit form
    // Return these elements as a string, HTMLElement, or jQuery object
    let year = hero.firstSeen.getFullYear();
    let month = hero.firstSeen.getMonth() + 1;
    let day = hero.firstSeen.getDate();

    if (month < 10) 
        month = '0' + month;
    if (day < 10) 
        day = '0' + day;

    let date = `${year}-${month}-${day}`;

    return  `
        <div id="form${hero.id}" class="column">
            <div class="card">
                <div class="card-banner" style="background-color:${hero.backgroundColor}">
                    <img src="${hero.img}">
                </div>
                <form class="card-content">
                    <div class="field">
                        <label class="label">Hero Name</label>
                        <div class="control">
                            <input id="name${hero.id}" class="input" value="${hero.name}">
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">Fisrt Name</label>
                        <div class="control">
                            <input id="first${hero.id}" class="input" value="${hero.first}">
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">Last Name</label>
                        <div class="control">
                            <input id="last${hero.id}" class="input" value="${hero.last}">
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">Subtitle</label>
                        <div class="control">
                            <input id="subtitle${hero.id}" class="input" value="${hero.subtitle}">
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">First Apperance</label>
                        <div class="control">
                            <input id="date${hero.id}" type="date" class="input" value="${date}">
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">Description</label>
                        <div class="control">
                            <textarea id="description${hero.id}" class="textarea" rows="4">${hero.description}</textarea>
                        </div>
                    </div>
                    <br>
                    <div class="buttons">
                        <button id="cancel${hero.id}" class="button is-red cancel" type="button">Cancel</button>
                        <button id="save${hero.id}" class="button is-gray" type="submit">Save</button>
                    </div>
                </form>
            </div>
        </div>`
};




/**
 * Handles the JavaScript event representing a user clicking on the "edit"
 *     button for a particular hero.
 * @param event  The JavaScript event that is being handled
 */
export const handleEditButtonPress = function(event) {
    // Render the hero edit form for the clicked hero and replace the
    // hero's card in the DOM with their edit form instead
    let id = event.target.id.substring(4);
    $(`#hero${id}`).replaceWith(renderHeroEditForm(heroicData.find(h => id == h.id)));
    $(`#cancel${id}`).on('click', handleCancelButtonPress);
    $(`#save${id}`).on('click', handleEditFormSubmit);
};



/**
 * Handles the JavaScript event representing a user clicking on the "cancel"
 *     button for a particular hero.
 * @param event  The JavaScript event that is being handled
 */
export const handleCancelButtonPress = function(event) {
    // Render the hero card for the clicked hero and replace the
    // hero's edit form in the DOM with their card instead
    let id = event.target.id.substring(6);
    $(`#form${id}`).replaceWith(renderHeroCard(heroicData.find(h => id == h.id)));
    $(`#edit${id}`).on('click', handleEditButtonPress);
};



/**
 * Handles the JavaScript event representing a user clicking on the "cancel"
 *     button for a particular hero.
 * @param event  The JavaScript event that is being handled
 */
export const handleEditFormSubmit = function(event) {
    // TODO: Render the hero card using the updated field values from the
    //       submitted form and replace the hero's edit form in the DOM with
    //       their updated card instead
    let id = event.target.id.substring(4);
    let hero = heroicData.find(h => id == h.id);
    hero.name = $(`#name${id}`).val();
    hero.first = $(`#first${id}`).val();
    hero.last = $(`#last${id}`).val();
    hero.subtitle = $(`#subtitle${id}`).val();
    let date = $(`#date${id}`).val().split('-');
    hero.firstSeen = new Date(date[0], parseInt(date[1])-1, parseInt(date[2]));
    hero.description = $(`#description${id}`).val();
    $(`#form${id}`).replaceWith(renderHeroCard(hero));
    $(`#edit${id}`).on('click', handleEditButtonPress);
};



/**
 * Given an array of hero objects, this function converts the data into HTML,
 *     loads it into the DOM, and adds event handlers.
 * @param  heroes  An array of hero objects to load (see data.js)
 */
export const loadHeroesIntoDOM = function(heroes) {
    // Grab a jQuery reference to the root HTML element
    const $root = $('#root');

    // Generate the heroes using renderHeroCard()
    // Append the hero cards to the $root element
    for (let hero of heroes) {
        $root.append(renderHeroCard(hero));
    }

    // clicking the edit button
    $('.edit').on('click', handleEditButtonPress);

    // submitting the form
    $('.save').on('click', handleEditFormSubmit);

    // clicking the cancel button
    $('.cancel').on('click', handleCancelButtonPress);
};



/**
 * Use jQuery to execute the loadHeroesIntoDOM function after the page loads
 */
$(function() {
    loadHeroesIntoDOM(heroicData);
});
